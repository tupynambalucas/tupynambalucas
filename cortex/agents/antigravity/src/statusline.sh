#!/bin/bash
# Antigravity CLI - Status Line
# Mounted at: /root/.gemini/antigravity-cli/statusline.sh
# Outputs a single line displayed in the CLI status bar.
echo "Tupynambá Lucas | $(git -C /workspace rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'no-git') | /workspace"
