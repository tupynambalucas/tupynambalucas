#!/usr/bin/env bash
# ==============================================================================
#  Tupynambá Lucas - GitHub Interactive DevOps Menu
# ==============================================================================
set -euo pipefail

# ANSI color codes for sleek UI
BOLD="\033[1m"
GREEN="\033[32m"
BLUE="\033[34m"
YELLOW="\033[33m"
CYAN="\033[36m"
RED="\033[31m"
RESET="\033[0m"

EXTENSION_DIR="/workspace/tools/github/services/gh/extensions"

# Visual header rendering
print_header() {
  clear
  echo -e "${BLUE}====================================================${RESET}"
  echo -e "${BOLD}${CYAN}          TUPYNAMBÁ LUCAS - DEVOPS TERMINAL MENU       ${RESET}"
  echo -e "${BLUE}====================================================${RESET}"
  echo -e "   Active Repository: ${BOLD}${GREEN}${GH_REPO:-tupynambalucas/tupynambalucas}${RESET}"
  echo -e "   Environment:       ${BOLD}${YELLOW}Docker Interactive (gh)${RESET}"
  echo -e "${BLUE}----------------------------------------------------${RESET}"
}

# 1. Initialize core menu actions
options=(
  "Generate Project Roadmap"
  "Generate Commit Changelog"
  "Check Authentication Status"
)
actions=(
  "cd /workspace && pnpm github:generate:roadmap"
  "cd /workspace && pnpm github:generate:changelog"
  "gh auth status"
)

# 2. Dynamic Discovery of Local Extensions
plugin_files=()
if [[ -d "$EXTENSION_DIR" ]]; then
  while IFS= read -r -d '' file; do
    if [[ -x "$file" ]]; then
      # Parse title from metadata line: # Menu-Title: My Title
      title=$(grep -m1 "^# Menu-Title:" "$file" | sed 's/# Menu-Title://' | xargs)
      if [[ -n "$title" ]]; then
        options+=("$title (Extension)")
        actions+=("$file")
        plugin_files+=("$file")
      fi
    fi
  done < <(find "$EXTENSION_DIR" -maxdepth 1 -name "ext_*.sh" -print0 2>/dev/null)
fi

options+=("Exit Menu")

# Main selection loop
while true; do
  print_header
  
  # Display choices
  for i in "${!options[@]}"; do
    echo -e "  [$((i+1))] ${BOLD}${options[$i]}${RESET}"
  done
  echo -e "${BLUE}----------------------------------------------------${RESET}"
  
  read -rp "Select an option [1-${#options[@]}]: " choice
  
  # Validate numeric range
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt "${#options[@]}" ]; then
    echo -e "\n${RED}Invalid option! Please enter a number between 1 and ${#options[@]}.${RESET}"
    sleep 1.5
    continue
  fi
  
  idx=$((choice-1))
  
  # Check if Exit is selected
  if [ "$idx" -eq $((${#options[@]}-1)) ]; then
    echo -e "\n${BOLD}${GREEN}Exiting DevOps Menu. Have a nice coding session!${RESET}\n"
    break
  fi
  
  # Execute selected action
  selected_action="${actions[$idx]}"
  echo -e "\n${BOLD}${BLUE}[INFO] Executing: ${options[$idx]}...${RESET}\n"
  
  # Execute the command and capture its exit code safely
  set +e
  eval "$selected_action"
  exit_code=$?
  set -e
  
  if [ "$exit_code" -eq 0 ]; then
    echo -e "\n${BOLD}${GREEN}[SUCCESS] Command completed successfully.${RESET}"
  else
    echo -e "\n${BOLD}${RED}[ERROR] Command failed during execution (Exit code: $exit_code).${RESET}"
  fi
  
  echo ""
  read -n 1 -s -r -p "Press any key to return to the menu..."
done
