#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# CrossCollab.tech is a static HTML/CSS/JS site with no build system.
# No dependencies to install. Ensure a basic static server is available
# so Claude can preview the site during the session.

# Make sure Python 3 is available (used for local preview)
if ! command -v python3 &>/dev/null; then
  echo "Warning: python3 not found; 'python3 -m http.server' previews won't work."
fi

# If npx/node is available, ensure 'serve' can be used as an alternative
if command -v npx &>/dev/null; then
  npx --yes serve --version &>/dev/null || true
fi

echo "Session start complete. No dependencies to install (static site)."
echo "To preview locally: python3 -m http.server 8080 --directory docs"
