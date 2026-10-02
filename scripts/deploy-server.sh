#!/usr/bin/env bash
# Rebuilds and restarts the ReBAT website (8011), backend (8012) and admin
# panel (8013). Run on the server after uploading new code to ~/rebat.
set -euo pipefail

ROOT="$HOME/rebat"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
export NEXT_TELEMETRY_DISABLED=1

echo "== backend"
cd "$ROOT/backend"
venv/bin/pip install -q -r requirements.txt
venv/bin/python manage.py migrate --noinput
venv/bin/python manage.py collectstatic --noinput >/dev/null
sudo systemctl restart rebat-backend

echo "== dependencies"
cd "$ROOT"
pnpm install --no-frozen-lockfile

echo "== website build"
pnpm build

echo "== admin panel build"
(cd admin-panel && pnpm build)

echo "== restart"
pm2 startOrReload ecosystem.config.cjs
pm2 save

sleep 5
for port in 8011 8012 8013; do
  curl -s -o /dev/null -w "https port $port -> %{http_code}\n" "https://34.231.15.242:$port/"
done
