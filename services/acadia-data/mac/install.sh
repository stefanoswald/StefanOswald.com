#!/bin/bash
# Sets up the Acadia data service on a Mac. Run it again any time. It never erases the database
# and never changes the keys once they exist.
#
#   bash install.sh
#
# What it does:
#   1. Makes the folder ~/acadia-data on this Mac's own disk. The database must not sit on a
#      network share, because SQLite files can be damaged there.
#   2. Copies server.mjs into that folder.
#   3. Finds Node.js 22.13 or newer. If there is none, it asks before downloading a private copy
#      from nodejs.org into ~/acadia-data/node. Nothing else on the Mac is changed.
#   4. Makes two long random keys and saves them in ~/acadia-data/.env. They are never shown on
#      screen.
#   5. Adds a launch agent so the service starts at login and restarts if it stops. While it
#      runs, it keeps the Mac from going to sleep.
#
# It does not need an administrator password.

set -euo pipefail

SRC_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="${ACADIA_APP_DIR:-$HOME/acadia-data}"
PORT="${ACADIA_PORT:-8787}"
LABEL="com.acadiaestates.data"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
ENV_FILE="$APP_DIR/.env"

say() { printf '\n%s\n' "$*"; }
fail() { printf '\nStopped: %s\n' "$*" >&2; exit 1; }

if [ "$(uname -s)" != "Darwin" ] && [ -z "${ACADIA_SKIP_OS_CHECK:-}" ]; then
  fail "This script is for a Mac."
fi

SERVER_SRC="$SRC_DIR/server.mjs"
[ -f "$SERVER_SRC" ] || SERVER_SRC="$SRC_DIR/../server.mjs"
[ -f "$SERVER_SRC" ] || fail "server.mjs was not found next to this script."

case "$APP_DIR" in
  /Volumes/*) fail "The data folder cannot be on a network share. Use a folder on this Mac, such as ~/acadia-data." ;;
esac

say "Setting up the Acadia data service in $APP_DIR"
mkdir -p "$APP_DIR/data" "$APP_DIR/logs"
chmod 700 "$APP_DIR"
cp "$SERVER_SRC" "$APP_DIR/server.mjs"

# ---- Node.js ----

node_ok() {
  "$1" -e 'const [a, b] = process.versions.node.split(".").map(Number); process.exit(a > 22 || (a === 22 && b >= 13) ? 0 : 1)' >/dev/null 2>&1
}

find_node() {
  local candidate
  for candidate in "$APP_DIR/node/bin/node" "$(command -v node 2>/dev/null || true)" /opt/homebrew/bin/node /usr/local/bin/node; do
    if [ -n "$candidate" ] && [ -x "$candidate" ] && node_ok "$candidate"; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
}

download_node() {
  local arch platform base tmp line expected file actual
  case "$(uname -m)" in
    arm64 | aarch64) arch="arm64" ;;
    x86_64) arch="x64" ;;
    *) fail "This Mac's chip type is not supported: $(uname -m)" ;;
  esac
  platform="${ACADIA_NODE_PLATFORM:-darwin}"
  tmp="$(mktemp -d)"

  # "latest-krypton" is nodejs.org's own name for the newest Node.js 24 release.
  for base in "https://nodejs.org/dist/latest-krypton" "https://nodejs.org/dist/latest-v24.x"; do
    if curl -fsSL "$base/SHASUMS256.txt" -o "$tmp/SHASUMS256.txt"; then break; fi
    base=""
  done
  [ -n "$base" ] || fail "Could not reach nodejs.org. Check the internet connection and run this again."

  line="$(grep -E "  node-v[0-9.]+-$platform-$arch\.tar\.gz$" "$tmp/SHASUMS256.txt" | head -1 || true)"
  [ -n "$line" ] || fail "nodejs.org did not list a download for this Mac."
  expected="${line%% *}"
  file="${line##* }"

  say "Downloading $file from nodejs.org"
  curl -fSL --progress-bar "$base/$file" -o "$tmp/$file" || fail "The download did not finish. Run this again."
  actual="$(shasum -a 256 "$tmp/$file" | awk '{print $1}')"
  [ "$actual" = "$expected" ] || fail "The download did not match its checksum, so it was not used."

  rm -rf "$APP_DIR/node"
  mkdir -p "$APP_DIR/node"
  tar -xzf "$tmp/$file" -C "$APP_DIR/node" --strip-components=1
  rm -rf "$tmp"
}

NODE=""
if [ -z "${ACADIA_FORCE_NODE_DOWNLOAD:-}" ]; then
  NODE="$(find_node || true)"
fi
if [ -z "$NODE" ]; then
  say "This Mac has no Node.js that is new enough (22.13 or newer)."
  printf 'Download a private copy (about 50 MB) from nodejs.org into %s/node? [y/N] ' "$APP_DIR"
  read -r answer
  case "$answer" in
    y | Y | yes | YES) download_node ;;
    *) fail "Node.js is needed. Nothing was downloaded." ;;
  esac
  NODE="$APP_DIR/node/bin/node"
  node_ok "$NODE" || fail "The downloaded Node.js did not run."
fi
say "Using Node.js $("$NODE" --version) at $NODE"

# ---- Keys ----
# Two long random secrets. They are written to a file only this user can read. They are never
# printed, so they do not end up in the Terminal window.

random_key() { openssl rand -base64 "$1" | tr -d '/+=\n'; }

if [ ! -f "$ENV_FILE" ]; then
  (
    umask 077
    {
      printf 'ACADIA_DATA_KEY=%s\n' "$(random_key 48)"
      printf 'ACADIA_ADMIN_KEY=%s\n' "$(random_key 36)"
    } > "$ENV_FILE"
  )
  say "Made new keys in $ENV_FILE"
else
  say "Keeping the keys already in $ENV_FILE"
fi
chmod 600 "$ENV_FILE"
grep -q '^ACADIA_DATA_KEY=.\{32,\}' "$ENV_FILE" || fail "$ENV_FILE has no usable ACADIA_DATA_KEY. Move that file aside and run this again."

# ---- Start script ----

cat > "$APP_DIR/run.sh" <<RUN
#!/bin/bash
# Started by the launch agent. Do not run two copies at once.
APP_DIR="$APP_DIR"
NODE="$NODE"
LOG="\$APP_DIR/logs/service.log"

mkdir -p "\$APP_DIR/logs"
if [ -f "\$LOG" ] && [ "\$(wc -c < "\$LOG")" -gt 20000000 ]; then
  mv -f "\$LOG" "\$LOG.1"
fi
exec >> "\$LOG" 2>&1

ACADIA_DATA_KEY="\$(grep '^ACADIA_DATA_KEY=' "\$APP_DIR/.env" | head -1 | cut -d= -f2-)"
export ACADIA_DATA_KEY
export ACADIA_DATA_DIR="\$APP_DIR/data"
export HOST="127.0.0.1"
export PORT="$PORT"

# Keeps the Mac from going to sleep for as long as the service runs.
if [ -x /usr/bin/caffeinate ]; then
  /usr/bin/caffeinate -i -w \$\$ &
fi

exec "\$NODE" "\$APP_DIR/server.mjs"
RUN
chmod 700 "$APP_DIR/run.sh"
printf '%s\n' "$NODE" > "$APP_DIR/node-path"

# ---- Launch agent ----

mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST" <<PLIST_END
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$APP_DIR/run.sh</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$APP_DIR</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ThrottleInterval</key>
  <integer>10</integer>
</dict>
</plist>
PLIST_END

USER_ID="$(id -u)"
launchctl bootout "gui/$USER_ID/$LABEL" >/dev/null 2>&1 || true
sleep 1
if ! launchctl bootstrap "gui/$USER_ID" "$PLIST" >/dev/null 2>&1; then
  sleep 2
  launchctl bootstrap "gui/$USER_ID" "$PLIST" >/dev/null 2>&1 || launchctl load -w "$PLIST" || fail "The launch agent could not be started."
fi

# ---- Check ----

say "Waiting for the service to answer"
ready=""
for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  if curl -fsS -m 2 "http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
    ready="yes"
    break
  fi
  sleep 0.5
done
[ -n "$ready" ] || fail "The service did not answer. Look at $APP_DIR/logs/service.log"

cat <<DONE

The Acadia data service is running on this Mac.

  Database:  $APP_DIR/data/acadia.db
  Backups:   $APP_DIR/data/backups  (one copy a day, last 30 kept)
  Log:       $APP_DIR/logs/service.log

It starts by itself when you log in to this Mac. macOS may show a note that a background item
was added. That is this service.

Next: install Tailscale, sign in, then run connect-tailscale.sh from the same folder as this script.
DONE
