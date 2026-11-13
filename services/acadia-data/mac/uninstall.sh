#!/bin/bash
# Stops the Acadia data service on this Mac and removes its launch agent.
# The database, backups, and keys in ~/acadia-data are left alone.

set -euo pipefail

APP_DIR="${ACADIA_APP_DIR:-$HOME/acadia-data}"
LABEL="com.acadiaestates.data"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"

launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
rm -f "$PLIST"

cat <<DONE

The Acadia data service is stopped and will not start again at login.

Nothing was erased. The database, backups, and keys are still in $APP_DIR.
To turn the tunnel off as well, run:  tailscale funnel reset
DONE
