# COMMANDS — Working Commands Reference

<!-- !! FOR AI: Update this file after EVERY step. Add new working commands, remove broken ones, fix any that changed. Keep it accurate — user copies these directly. !! -->

All commands tested and confirmed working on this machine.
Copy-paste directly — do not modify unless you know what you're doing.

---

## Project Root
```
/home/switchgod/Desktop/pickbazar/
```

---

## Install Dependencies

```bash
# API (takes ~2 min)
cd /home/switchgod/Desktop/pickbazar/api/rest && npm install --legacy-peer-deps

# Shop (takes ~17 min — run in background)
cd /home/switchgod/Desktop/pickbazar/shop && npm install --legacy-peer-deps --maxsockets=2

# Admin (takes ~17 min — run in background)
cd /home/switchgod/Desktop/pickbazar/admin/rest && npm install --legacy-peer-deps --maxsockets=2
```

**Note:** If npm hangs, add `--maxsockets=2` to limit connections.

---

## Build

```bash
# API (NestJS) — must be built before shop build
cd /home/switchgod/Desktop/pickbazar/api/rest && npx nest build

# Shop (Next.js) — API must be running on :9000 during this build
cd /home/switchgod/Desktop/pickbazar/shop && npm run build:rest

# Admin (Next.js)
cd /home/switchgod/Desktop/pickbazar/admin/rest && npm run build
```

---

## Run (Production via PM2)

```bash
# Start API
pm2 start dist/main.js --name api --cwd /home/switchgod/Desktop/pickbazar/api/rest

# Start Shop on port 3003
pm2 start npm --name shop --cwd /home/switchgod/Desktop/pickbazar/shop -- run start -- -p 3003

# Start Admin on port 3002
pm2 start npm --name admin --cwd /home/switchgod/Desktop/pickbazar/admin/rest -- run start -- -p 3002

# Check status
pm2 status

# View logs (all or specific)
pm2 logs
pm2 logs shop

# Restart a service
pm2 restart shop

# Stop / Start
pm2 stop shop
pm2 start shop

# Save process list + auto-start on reboot
pm2 save
pm2 startup
```

---

## Cloudflare Tunnel (After Step 5)

```bash
# Login (opens browser)
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create switchgod-tunnel

# Route DNS
cloudflared tunnel route dns switchgod-tunnel switchgod.com.np
cloudflared tunnel route dns switchgod-tunnel admin.switchgod.com.np
cloudflared tunnel route dns switchgod-tunnel api.switchgod.com.np

# Run tunnel
cloudflared tunnel run switchgod-tunnel
```

---

## Git (After Step 4)

```bash
cd /home/switchgod/Desktop/pickbazar
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/switchgod/pickbazar.git
git push -u origin main
```

---

## Test API

```bash
# Quick test — should return products JSON
curl http://localhost:9000/api/products | head -c 200
```

---

## .env.local IP Addresses (Current)

```bash
# Shop: /home/switchgod/Desktop/pickbazar/shop/.env.local
NEXT_PUBLIC_REST_API_ENDPOINT="http://192.168.254.251:9000/api"
NEXT_PUBLIC_ADMIN_URL="http://192.168.254.251:3002"
NEXTAUTH_URL=http://192.168.254.251:3003

# Admin: /home/switchgod/Desktop/pickbazar/admin/rest/.env.local
NEXT_PUBLIC_REST_API_ENDPOINT="http://192.168.254.251:9000/api"
NEXT_PUBLIC_SHOP_URL="http://192.168.254.251:3003"
```

**Note:** After Cloudflare Tunnel is set up, these will change to domain names.
If you change these, you must rebuild and restart:
```bash
# Rebuild shop (API must be running)
cd /home/switchgod/Desktop/pickbazar/shop && npm run build:rest && pm2 restart shop

# Rebuild admin
cd /home/switchgod/Desktop/pickbazar/admin/rest && npm run build && pm2 restart admin
```

---

## Cleanup (If Needed)

```bash
# Remove all node_modules (full reinstall)
cd /home/switchgod/Desktop/pickbazar
rm -rf api/rest/node_modules shop/node_modules admin/rest/node_modules

# Remove .next build caches
rm -rf shop/.next admin/rest/.next
```
