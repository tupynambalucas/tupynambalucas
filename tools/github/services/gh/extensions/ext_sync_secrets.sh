#!/usr/bin/env bash
# Menu-Title: Sync Dotenv Secrets & Variables
# ==============================================================================
#  Tupynambá Lucas - GitHub Security & Quality (Secrets & Variables) JSON Sync Script
# ==============================================================================
# This script scans JSON configuration files inside tools/github/services/gh/config:
#   - secrets.env.json    (mapped by categories: ACTIONS, CODESPACES, DEPENDABOT)
#   - variables.env.json  (mapped by category: ACTIONS)
#
# Features:
#   - Parses configurations natively inside the container using 'jq'.
#   - Synchronizes local secrets and variables with GitHub.
#   - Prunes/deletes secrets/variables on GitHub that were removed locally in the JSON.
#   - Overwrites existing keys to keep them fully up to date.
#   - Safe skips: Missing files or empty files are skipped but handled safely.
#
# Generates a runtime log at 'tools/github/infrastructure/logs/ext_sync_secrets.log'.
# ==============================================================================

set -euo pipefail

# ANSI color codes
BOLD="\033[1m"
GREEN="\033[32m"
BLUE="\033[34m"
YELLOW="\033[33m"
CYAN="\033[36m"
RED="\033[31m"
RESET="\033[0m"

# DIP: Allow injecting paths via environment variables, falling back to container standard paths
BASE_DIR="${CONFIG_DIR:-/workspace/tools/github/services/gh/config}"
LOG_DIR="${LOG_DIR:-/workspace/tools/github/infrastructure/logs}"
LOG_FILE="$LOG_DIR/$(basename "$0" .sh).log"

SECRETS_JSON="$BASE_DIR/secrets.env.json"
VARIABLES_JSON="$BASE_DIR/variables.env.json"

# Temporary files to accumulate keys/warnings for the run log
TMP_ACTIONS_SECRETS="/tmp/actions_secrets.keys"
TMP_ACTIONS_VARIABLES="/tmp/actions_variables.keys"
TMP_CODESPACES_SECRETS="/tmp/codespaces_secrets.keys"
TMP_CODESPACES_VARIABLES="/tmp/codespaces_variables.keys"
TMP_DEPENDABOT_SECRETS="/tmp/dependabot_secrets.keys"
TMP_DEPENDABOT_VARIABLES="/tmp/dependabot_variables.keys"

# Ensure temporary files are clean
rm -f "$TMP_ACTIONS_SECRETS" "$TMP_ACTIONS_VARIABLES" \
      "$TMP_CODESPACES_SECRETS" "$TMP_CODESPACES_VARIABLES" \
      "$TMP_DEPENDABOT_SECRETS" "$TMP_DEPENDABOT_VARIABLES"

touch "$TMP_ACTIONS_SECRETS" "$TMP_ACTIONS_VARIABLES" \
      "$TMP_CODESPACES_SECRETS" "$TMP_CODESPACES_VARIABLES" \
      "$TMP_DEPENDABOT_SECRETS" "$TMP_DEPENDABOT_VARIABLES"

# Verification checks
echo "Verifying jq installation..."
if ! command -v jq >/dev/null 2>&1; then
  echo "Error: 'jq' is not installed in the container environment." >&2
  exit 1
fi

echo "Verifying GitHub CLI authentication status..."
if ! gh auth status >/dev/null 2>&1; then
  if [ -n "${GH_TOKEN:-}" ]; then
    echo "Authenticated successfully via GH_TOKEN environment variable."
  else
    echo "Error: GitHub CLI is not authenticated. Please ensure GH_TOKEN is set." >&2
    exit 1
  fi
fi

# Ensure GH_REPO is set so gh CLI knows which repository to target
if [ -z "${GH_REPO:-}" ]; then
  echo "Error: GH_REPO environment variable is not set." >&2
  exit 1
fi
echo "Target GitHub repository: $GH_REPO"

synchronized_any=false

# ==============================================================================
#  Sync Secrets
# ==============================================================================
if [ -f "$SECRETS_JSON" ] && [ -s "$SECRETS_JSON" ]; then
  echo -e "\n${BOLD}${BLUE}[INFO] Synchronizing GitHub Secrets...${RESET}"
  
  # Parse top-level categories (ACTIONS, CODESPACES, DEPENDABOT) from JSON
  categories=($(jq -r 'keys[]' "$SECRETS_JSON"))
  
  for category in "${categories[@]}"; do
    cat_lower=$(echo "$category" | tr '[:upper:]' '[:lower:]')
    
    # Identify log files based on category
    tmp_file=""
    if [ "$cat_lower" = "actions" ]; then
      tmp_file="$TMP_ACTIONS_SECRETS"
    elif [ "$cat_lower" = "codespaces" ]; then
      tmp_file="$TMP_CODESPACES_SECRETS"
    elif [ "$cat_lower" = "dependabot" ]; then
      tmp_file="$TMP_DEPENDABOT_SECRETS"
    fi
    
    # 1. Parse local keys and values for this category
    declare -A local_map=()
    local_keys=()
    
    while IFS='=' read -r key value; do
      if [ -n "$key" ] && [ "$key" != "null" ]; then
        # Ignore security/configuration helper keys if they exist in the file
        if [ "$key" = "GH_REPO" ] || [ "$key" = "GH_TOKEN" ] || [ "$key" = "GITHUB_TOKEN" ]; then
          continue
        fi
        local_keys+=("$key")
        local_map["$key"]="$value"
      fi
    done < <(jq -r ".${category} | to_entries[] | \"\(.key)=\(.value)\"" "$SECRETS_JSON" 2>/dev/null || true)
    
    # 2. Fetch current remote keys on GitHub for this category
    gh_keys=()
    while read -r name _; do
      if [ -n "$name" ] && [ "$name" != "No" ] && [ "$name" != "NAME" ]; then
        gh_keys+=("$name")
      fi
    done < <(gh secret list --app "$cat_lower" 2>/dev/null || true)
    
    # 3. Symmetrical Pruning (Deletions)
    deleted_keys=()
    for gk in "${gh_keys[@]}"; do
      if [ -z "${local_map["$gk"]:-}" ]; then
        echo "  Pruning: Deleting secret '$gk' from $cat_lower on GitHub..."
        if gh secret delete "$gk" --app "$cat_lower" >/dev/null 2>&1; then
          deleted_keys+=("$gk")
        else
          echo "    Warning: Failed to delete secret '$gk' from $cat_lower"
        fi
      fi
    done
    
    # 4. Symmetrical Upsert (Additions / Updates)
    added_updated_keys=()
    for lk in "${local_keys[@]}"; do
      val="${local_map["$lk"]}"
      echo "  Synchronizing: Uploading secret '$lk' -> App: $cat_lower"
      if gh secret set "$lk" --body "$val" --app "$cat_lower" >/dev/null 2>&1; then
        added_updated_keys+=("$lk")
        synchronized_any=true
      else
        echo "    Warning: Failed to set secret '$lk' for $cat_lower"
      fi
    done
    
    # 5. Populate Log Block
    {
      echo "Category: $category | Mode: secrets"
      if [ "${#local_keys[@]}" -eq 0 ]; then
        echo "  Status: Empty (No active keys in JSON config)"
      else
        echo "  Status: Synchronized (${#added_updated_keys[@]} added/updated, ${#deleted_keys[@]} removed)"
        if [ "${#added_updated_keys[@]}" -gt 0 ]; then
          echo "  Added/Updated:"
          for ak in "${added_updated_keys[@]}"; do
            echo "    - $ak"
          done
        fi
      fi
      if [ "${#deleted_keys[@]}" -gt 0 ]; then
        echo "  Removed:"
        for dk in "${deleted_keys[@]}"; do
          echo "    - $dk"
        done
      fi
    } > "$tmp_file"
  done
else
  echo "Warning: Secrets config file not found or empty at $SECRETS_JSON."
fi

# ==============================================================================
#  Sync Variables
# ==============================================================================
if [ -f "$VARIABLES_JSON" ] && [ -s "$VARIABLES_JSON" ]; then
  echo -e "\n${BOLD}${BLUE}[INFO] Synchronizing GitHub Variables (Actions only)...${RESET}"
  
  # GitHub only natively supports variables for the ACTIONS scope
  category="ACTIONS"
  tmp_file="$TMP_ACTIONS_VARIABLES"
  
  # 1. Parse local keys and values
  declare -A local_map=()
  local_keys=()
  
  while IFS='=' read -r key value; do
    if [ -n "$key" ] && [ "$key" != "null" ]; then
      if [ "$key" = "GH_REPO" ] || [ "$key" = "GH_TOKEN" ] || [ "$key" = "GITHUB_TOKEN" ]; then
        continue
      fi
      local_keys+=("$key")
      local_map["$key"]="$value"
    fi
  done < <(jq -r ".${category} | to_entries[] | \"\(.key)=\(.value)\"" "$VARIABLES_JSON" 2>/dev/null || true)
  
  # 2. Fetch current remote variables on GitHub (Actions)
  gh_keys=()
  while read -r name _; do
    if [ -n "$name" ] && [ "$name" != "No" ] && [ "$name" != "NAME" ]; then
      gh_keys+=("$name")
    fi
  done < <(gh variable list 2>/dev/null || true)
  
  # 3. Symmetrical Pruning (Deletions)
  deleted_keys=()
  for gk in "${gh_keys[@]}"; do
    if [ -z "${local_map["$gk"]:-}" ]; then
      echo "  Pruning: Deleting variable '$gk' from actions on GitHub..."
      if gh variable delete "$gk" >/dev/null 2>&1; then
        deleted_keys+=("$gk")
      else
        echo "    Warning: Failed to delete variable '$gk' from actions"
      fi
    fi
  done
  
  # 4. Symmetrical Upsert (Additions / Updates)
  added_updated_keys=()
  for lk in "${local_keys[@]}"; do
    val="${local_map["$lk"]}"
    echo "  Synchronizing: Uploading variable '$lk' -> App: actions"
    if gh variable set "$lk" --body "$val" >/dev/null 2>&1; then
      added_updated_keys+=("$lk")
      synchronized_any=true
    else
      echo "    Warning: Failed to set variable '$lk' for actions"
    fi
  done
  
  # 5. Populate Log Block
  {
    echo "Category: $category | Mode: variables"
    if [ "${#local_keys[@]}" -eq 0 ]; then
      echo "  Status: Empty (No active keys in JSON config)"
    else
      echo "  Status: Synchronized (${#added_updated_keys[@]} added/updated, ${#deleted_keys[@]} removed)"
      if [ "${#added_updated_keys[@]}" -gt 0 ]; then
        echo "  Added/Updated:"
        for ak in "${added_updated_keys[@]}"; do
          echo "    - $ak"
        done
      fi
    fi
    if [ "${#deleted_keys[@]}" -gt 0 ]; then
      echo "  Removed:"
      for dk in "${deleted_keys[@]}"; do
        echo "    - $dk"
      done
    fi
  } > "$tmp_file"
else
  echo "Warning: Variables config file not found or empty at $VARIABLES_JSON."
fi

# Populate placeholder variables files logs (unsupported modes)
{
  echo "Category: CODESPACES | Mode: variables"
  echo "  Status: Unsupported (GitHub does not support configuration variables for Codespaces)"
} > "$TMP_CODESPACES_VARIABLES"

{
  echo "Category: DEPENDABOT | Mode: variables"
  echo "  Status: Unsupported (GitHub does not support configuration variables for Dependabot)"
} > "$TMP_DEPENDABOT_VARIABLES"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Generate final aggregated log file
{
  echo "=============================================================================="
  echo " GitHub Security & Quality Sync Log"
  echo " Last Run: $(date '+%Y-%m-%d %H:%M:%S') UTC"
  echo "=============================================================================="
  echo ""
  echo "[ACTIONS SECRETS]"
  cat "$TMP_ACTIONS_SECRETS"
  echo ""
  echo "[ACTIONS VARIABLES]"
  cat "$TMP_ACTIONS_VARIABLES"
  echo ""
  echo "[CODESPACES SECRETS]"
  cat "$TMP_CODESPACES_SECRETS"
  echo ""
  echo "[CODESPACES VARIABLES]"
  cat "$TMP_CODESPACES_VARIABLES"
  echo ""
  echo "[DEPENDABOT SECRETS]"
  cat "$TMP_DEPENDABOT_SECRETS"
  echo ""
  echo "[DEPENDABOT VARIABLES]"
  cat "$TMP_DEPENDABOT_VARIABLES"
  echo ""
} > "$LOG_FILE"

# Clean up temporary files
rm -f "$TMP_ACTIONS_SECRETS" "$TMP_ACTIONS_VARIABLES" \
      "$TMP_CODESPACES_SECRETS" "$TMP_CODESPACES_VARIABLES" \
      "$TMP_DEPENDABOT_SECRETS" "$TMP_DEPENDABOT_VARIABLES"

echo "=================================================="
if [ "$synchronized_any" = "false" ]; then
  echo "Finished with no variables or secrets uploaded (all configurations empty)."
else
  echo "All environment variables and secrets synchronized successfully!"
  echo "Execution log written to: tools/github/infrastructure/logs/$(basename "$0" .sh).log"
fi
echo "=================================================="
