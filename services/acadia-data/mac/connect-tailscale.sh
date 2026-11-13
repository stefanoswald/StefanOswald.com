#!/bin/bash
# Gives the Acadia data service a steady https address with Tailscale Funnel, then writes the
# three settings for Vercel into one file. Run install.sh first.
#
#   bash connect-tailscale.sh
#
# Before running this: install Tailscale (Mac App Store or tailscale.com/download) and sign in.

set -euo pipefail

APP_DIR="${ACADIA_APP_DIR:-$HOME/acadia-data}"
PORT="${ACADIA_PORT:-8787}"
ENV_FILE="$APP_DIR/.env"
SETTINGS_FILE="$APP_DIR/vercel-settings.txt"

say() { printf '\n%s\n' "$*"; }
fail() { printf '\nStopped: %s\n' "$*" >&2; exit 1; }

[ -f "$ENV_FILE" ] || fail "Run install.sh first. $ENV_FILE does not exist yet."
curl -fsS -m 3 "http://127.0.0.1:$PORT/health" >/dev/null 2>&1 || fail "The data service is not running. Run install.sh again."

TS=""
for candidate in "$(command -v tailscale 2>/dev/null || true)" \
  "/Applications/Tailscale.app/Contents/MacOS/Tailscale" \
  "$HOME/Applications/Tailscale.app/Contents/MacOS/Tailscale" \
  /opt/homebrew/bin/tailscale /usr/local/bin/tailscale; do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then
    TS="$candidate"
    break
  fi
done
[ -n "$TS" ] || fail "Tailscale is not installed yet. Install it from the Mac App Store or tailscale.com/download, sign in, then run this again."
"$TS" status >/dev/null 2>&1 || fail "Tailscale is installed but not connected. Open Tailscale from the menu bar, sign in, then run this again."

say "Turning on the tunnel to port $PORT"
say "If Tailscale shows a web link below, open it, approve Funnel, then run this script again."
"$TS" funnel --bg --https=443 "$PORT" || fail "Tailscale did not turn the tunnel on. Follow any link it showed above, then run this again."

ADDRESS="${ACADIA_PUBLIC_URL:-}"
if [ -z "$ADDRESS" ]; then
  ADDRESS="$("$TS" funnel status 2>/dev/null | grep -Eo 'https://[A-Za-z0-9.-]+\.ts\.net' | head -1 || true)"
fi
if [ -z "$ADDRESS" ] && [ -f "$APP_DIR/node-path" ]; then
  NODE="$(cat "$APP_DIR/node-path")"
  NAME="$("$TS" status --json | "$NODE" -e 'let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => process.stdout.write((JSON.parse(s).Self.DNSName || "").replace(/\.$/, "")))' 2>/dev/null || true)"
  [ -n "$NAME" ] && ADDRESS="https://$NAME"
fi
[ -n "$ADDRESS" ] || fail "The tunnel is on, but its address could not be read. Run: \"$TS\" funnel status"

say "Checking $ADDRESS/health"
reachable=""
for _ in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if curl -fsS -m 5 "$ADDRESS/health" 2>/dev/null | grep -q '"acadia-data"'; then
    reachable="yes"
    break
  fi
  sleep 5
done

(
  umask 077
  {
    printf 'ACADIA_DATA_URL=%s\n' "$ADDRESS"
    grep '^ACADIA_DATA_KEY=' "$ENV_FILE" | head -1
    grep '^ACADIA_ADMIN_KEY=' "$ENV_FILE" | head -1
  } > "$SETTINGS_FILE"
)
chmod 600 "$SETTINGS_FILE"

if [ -n "$reachable" ]; then
  say "The tunnel works. Address: $ADDRESS"
else
  say "The tunnel is on at $ADDRESS but it did not answer yet. A new address can take about 10 minutes to start working."
fi

cat <<DONE

The three settings for Vercel are saved in:

  $SETTINGS_FILE

That file holds secrets. Keep it on this Mac. Do not email it or paste it into a chat.

In Vercel: open the project, then Settings, then Environment Variables. Copy all three lines
from the file and paste them into the first Key box. Vercel should fill in all three. If it
does not, add them one at a time. Choose Production only, then save.

To open the file now, run:  open -e "$SETTINGS_FILE"
DONE
