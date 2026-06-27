# RESUME — Read This First

<!-- !! FOR AI: Update this file after EVERY step completed. Move "Last completed" forward, update status table, and refresh "Next action". This is your memory — keep it current. !! -->

## Where We Stopped
- **Last completed:** Step 3 (all services built and running via PM2)
- **Current step:** Step 4 (Git init + GitHub repo + push code)
- **Next action:** Initialize git, create .gitignore, push to GitHub

## What Works Now
| Service | Port | PM2 Name | Status |
|---------|------|----------|--------|
| API (api/rest) | 9000 | api | ✅ Running via PM2 |
| Shop | 3003 | shop | ✅ Running via PM2 |
| Admin (admin/rest) | 3002 | admin | ✅ Running via PM2 |

## Quick Status
- Prerequisites: ✅ All installed (Node 18, npm, git, PM2, cloudflared, gh)
- Dependencies: ✅ All 3 services have node_modules
- .env files: ✅ All 3 created with LAN IP (192.168.254.251) for network access
- Build: ✅ All 3 services built successfully (rebuilt with IP for LAN access)
- PM2: ✅ All 3 running (api, shop, admin)
- LAN access: ✅ Working from other PCs on same network
- Git repo: ❌ Not initialized
- Cloudflare Tunnel: ❌ Not created
- Auto-deploy: ❌ Not created

## PM2 Commands
```bash
pm2 status              # Check all services
pm2 logs                # View all logs
pm2 logs shop           # View shop logs only
pm2 restart shop        # Restart shop
pm2 stop all            # Stop all
pm2 save                # Save process list
pm2 startup             # Auto-start on boot
```

## Important Rules
- **Package manager:** npm (NOT yarn — yarn hangs on this machine)
- **Install command:** `npm install --legacy-peer-deps`
- **Project path:** `/home/switchgod/Desktop/pickbazar/`
- **User level:** Beginner — explain commands before running
- **Shop start:** `next start` (NOT `start:rest`) on port 3003
- **Admin start:** `next start -p 3002`
- **API start:** `node dist/main.js` on port 9000
- **Shop build must have API running** (Next.js fetches from API at build time)
- **LAN access:** Use `http://192.168.254.251:PORT` from other PCs (not localhost)
- **After Cloudflare Tunnel:** URLs will change to `switchgod.com.np`, `admin.switchgod.com.np`, `api.switchgod.com.np`

## Next Commands to Run
```bash
# Step 4: Git + GitHub
cd /home/switchgod/Desktop/pickbazar
git init
# Create .gitignore, then:
git add .
git commit -m "Initial commit: PickBazar e-commerce"
gh repo create pickbazar --private --source=. --push
```
