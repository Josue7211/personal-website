# Deploy — docs.aparcedo.org

Self-hosted static site. Build local → rsync to services VM → cloudflared tunnel from media VM routes traffic.

## Build

```bash
cd docs-site
npm run build       # outputs ./dist
```

## First-time setup

### Services VM (hosting)

1. Install nginx if not present.
2. `sudo mkdir -p /var/www/docs-aparcedo/releases`
3. Copy `deploy/nginx.conf` to `/etc/nginx/sites-available/docs-aparcedo`, symlink into `sites-enabled/`, reload nginx.
4. Open internal port 8080 between media VM and services VM (firewall rule).

### Media VM (cloudflared tunnel)

1. Edit `/etc/cloudflared/config.yml`, splice in the block from `deploy/cloudflared-ingress.yml`.
2. Replace `SERVICES_VM_INTERNAL_ADDR` with services VM internal address.
3. `cloudflared tunnel route dns <tunnel-name> docs.aparcedo.org` (one time, creates the CNAME).
4. `sudo systemctl restart cloudflared`.

### DNS

Cloudflare manages the CNAME automatically via `tunnel route dns`. No manual record needed.

## Deploy a new release

```bash
# from repo root, on dev machine
npm run build:docs

TS=$(date +%Y%m%d-%H%M%S)
rsync -av --delete docs-site/dist/ services-vm:/var/www/docs-aparcedo/releases/$TS/
ssh services-vm "ln -sfnT /var/www/docs-aparcedo/releases/$TS /var/www/docs-aparcedo/current"
```

Atomic swap via symlink — no downtime, easy rollback by re-pointing `current` at a prior release dir.

## Health check

```bash
curl -I https://docs.aparcedo.org
ssh services-vm "curl -I -H 'Host: docs.aparcedo.org' http://127.0.0.1:8080/"
```

Expected: public and origin both return `200` or a normal redirect. If origin returns `200` but Cloudflare returns `403`, the static build is not the problem; check Cloudflare Access/WAF, tunnel hostname route, and DNS CNAME.

## Rollback

```bash
ssh services-vm "ls /var/www/docs-aparcedo/releases"
ssh services-vm "ln -sfn /var/www/docs-aparcedo/releases/<old-ts> /var/www/docs-aparcedo/current"
```

No nginx reload needed — symlink swap is picked up immediately.
