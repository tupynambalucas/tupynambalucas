#!/usr/bin/env bash
# Menu-Title: Hello World Custom Script
set -euo pipefail

echo "===================================================="
echo "    HELLO WORLD - ELO DEVOPS MENU EXTENSION!        "
echo "===================================================="
echo " This is a demonstration of our dynamic local"
echo " extension capabilities."
echo ""
echo " Current directory: $(pwd)"
echo " Active GH Repo:    ${GH_REPO:-tupynambalucas/tupynambalucas}"
echo " Logged user:       ${GH_AUTHOR_NAME:-Anonymous}"
echo "===================================================="
