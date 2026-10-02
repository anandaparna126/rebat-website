# ReBAT — deployment

Everything runs on the EC2 box `34.231.15.242` from `/home/ubuntu/rebat`.

| Public URL (HTTPS) | App | Code | Internal port / process |
| ------------------ | --- | ---- | ----------------------- |
| https://34.231.15.242:8011 | Website (Next.js) | `./` (repo root) | 127.0.0.1:3011, pm2 `rebat-website` |
| https://34.231.15.242:8012 | Backend API (Django) | `./backend` | 127.0.0.1:3012, systemd `rebat-backend` (gunicorn) |
| https://34.231.15.242:8013 | Admin panel (Next.js) | `./admin-panel` | 127.0.0.1:3013, pm2 `rebat-admin` |

## HTTPS

- nginx terminates TLS on 8011/8012/8013 and proxies to the localhost ports above
  (`deploy/nginx-rebat.conf` → `/etc/nginx/sites-available/rebat`). Plain `http://` on those
  ports, and `http://34.231.15.242/`, redirect to HTTPS.
- Certificate: Let's Encrypt **IP-address** certificate (short-lived, ~6 days), issued by a newer
  certbot in `~/rebat/certbot-venv` into its own dirs (`/etc/letsencrypt-rebat`), separate from
  Loomindica's certificate. `rebat-certbot-renew.timer` renews it twice a day and reloads nginx
  (`deploy/rebat-certbot-renew.*`). Renewal needs port 80 open for `/.well-known/acme-challenge/`.
- Check it: `systemctl list-timers | grep rebat` and
  `sudo ~/rebat/certbot-venv/bin/certbot certificates --config-dir /etc/letsencrypt-rebat`.
- When a real domain is pointed here, issue a normal domain certificate and switch to port 443.

- **Database:** MySQL database `rebat_website` on the same RDS instance as Loomindica (same user/host).
  Credentials live in `backend/.env` on the server (never committed; see `backend/.env.example`).
- **Node:** the Next apps need Node ≥ 20.9, so they run on nvm's Node 22
  (`~/.nvm/versions/node/v22.23.3`). The system Node 18 is untouched (vcare uses it).
- **Admin login:** the first super admin's credentials are in `~/rebat/ADMIN_CREDENTIALS.txt` on the server.
  Change the password after first login, then delete that file.
- Django's built-in admin is also available at `https://34.231.15.242:8012/django-admin/`.

## Environment files (server only)

- `.env.production` — `NEXT_PUBLIC_API_URL=https://34.231.15.242:8012`, `API_INTERNAL_URL=http://127.0.0.1:3012`
- `admin-panel/.env.production` — `NEXT_PUBLIC_API_URL=https://34.231.15.242:8012`, `NEXT_PUBLIC_SITE_URL=https://34.231.15.242:8011`

`NEXT_PUBLIC_*` values are baked in at build time; rebuild after changing them.
When a domain is added, update these plus `CORS_ALLOWED_ORIGINS` / `PUBLIC_BASE_URL` in `backend/.env`.

## Redeploying

Upload the changed files to `/home/ubuntu/rebat` (excluding `node_modules`, `.next`, `backend/venv`,
`backend/media`, `.env*`), then on the server:

```bash
bash ~/rebat/scripts/deploy-server.sh
```

It installs dependencies, runs migrations, rebuilds both Next apps and restarts all three services.

## How the pieces connect

- Every website form (contact page, enquiry modals, job "Apply") posts to `POST /api/enquiries/`
  and shows up under **Enquiries** in the admin panel.
- Homepage newsroom cards, `/newsroom`, `/newsroom/[slug]` and `/jobs` read from the backend
  (refreshed every 30s). If the backend is unreachable, the newsroom falls back to the articles
  bundled in `src/lib/newsroom.ts`.
- Images uploaded in the admin panel are stored in `backend/media/` and served from `https://…:8012/media/`.
