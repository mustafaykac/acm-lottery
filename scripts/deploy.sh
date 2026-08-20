#!/usr/bin/env bash
# Manual deploy: pull latest main, rebuild, restart the service.
# Usage (on the server): cd /var/www/acm-lottery && bash scripts/deploy.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICE_NAME="acm-lottery"
PORT="${PORT:-3060}"

cd "$APP_DIR"

echo "==> Pulling latest main..."
git fetch origin
git checkout main
git pull --ff-only origin main

echo "==> Installing dependencies..."
npm ci

echo "==> Building (standalone output)..."
npm run build

echo "==> Assembling standalone output (public/ + .next/static)..."
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static

# IMPORTANT: `next build` copies .env into .next/standalone/.env
# automatically. Next's own runtime env loader then re-parses that copy and
# expands "$" as if it were a shell variable reference, silently mangling
# the bcrypt ADMIN_PASSWORD_HASH (which is full of "$"). The real .env lives
# at the repo root and is loaded correctly via systemd's EnvironmentFile
# (which does NOT do "$" expansion) - so the auto-copied standalone one must
# be deleted every build, or login breaks with no obvious error.
rm -f .next/standalone/.env

echo "==> Restarting $SERVICE_NAME..."
sudo systemctl restart "$SERVICE_NAME"

echo "==> Waiting for the app to come back up..."
for i in $(seq 1 10); do
  if curl -sf "http://127.0.0.1:${PORT}/login" > /dev/null; then
    echo "==> Deploy successful. Now running:"
    git log -1 --oneline
    exit 0
  fi
  sleep 1
done

echo "==> App did not respond after restart - check: sudo journalctl -u $SERVICE_NAME -n 50 --no-pager"
exit 1
