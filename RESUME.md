# RESUME — Read This First

<!-- !! FOR AI: Update this file after EVERY step completed. Move "Last completed" forward, update status table, and refresh "Next action". This is your memory — keep it current. !! -->

## Where We Stopped
- **Last completed:** Session 15 — Fixed modal close button + back button for all screens
- **Current step:** Phase 8 complete, modal UX fixed, ready for Phase 1 (Customization)
- **Next action:** Phase 1 — Customization (logos, colors, branding) at `.deploy/PLAN.md`
- **Master plan:** `.deploy/PLAN.md` — 104 tasks across 8 phases (Phase 8 = 67 mobile audit tasks ✅)

## What Works Now
| Service | Port | PM2 Name | Status | Domain |
|---------|------|----------|--------|--------|
| API (api/rest) | 9000 | api | ✅ Running via PM2 | api.switchgod.com.np |
| Shop | 3003 | shop | ✅ Running via PM2 | switchgod.com.np |
| Admin (admin/rest) | 3002 | admin | ✅ Running via PM2 | admin.switchgod.com.np |
| Cloudflare Tunnel | - | tunnel | ✅ Running via PM2 | - |

## Quick Status
- Prerequisites: ✅ All installed (Node 18, npm, git, PM2, cloudflared, gh)
- Dependencies: ✅ All 3 services have node_modules
- .env files: ✅ All 3 created with public domain URLs
- Build: ✅ All 3 services built successfully (rebuilt with domain URLs)
- PM2: ✅ All 4 running (api, shop, admin, tunnel)
- PM2 auto-start on boot: ✅ Configured (systemd)
- LAN access: ✅ Working from other PCs on same network
- Git repo: ✅ Initialized + pushed to GitHub (mhzsajan/pickbazar)
- Cloudflare Tunnel: ✅ Running (switchgod-tunnel)
- Public URLs: ✅ switchgod.com.np, admin.switchgod.com.np, api.switchgod.com.np
- Font: ✅ Google Sans Code (SIL Open Font License — free for commercial use)
- Footer: ✅ Fixed — visual spacing audit completed, all 8 issues resolved
- Homepage: ✅ Footer shows, shops section positioned correctly, header cleaned up
- Mobile: ✅ All 67 mobile audit issues fixed (touch targets, z-index, spacing, responsive, dead code)
- Modal UX: ✅ Close button visible on all screens, back button/swipe-to-go-back works

## PM2 Commands
```bash
pm2 status              # Check all services
pm2 logs                # View all logs
pm2 logs shop           # View shop logs only
pm2 restart shop        # Restart shop
pm2 stop all            # Stop all
pm2 save                # Save process list (run after changes)
pm2 startup             # Auto-start on boot (requires sudo)
```

## Important Rules
- **Package manager:** npm (NOT yarn — yarn hangs on this machine)
- **Install command:** `npm install --legacy-peer-deps`
- **Font:** Google Sans Code via Fontsource CDN (SIL Open Font License — free for commercial use)
- **Project path:** `/home/switchgod/Desktop/pickbazar/`
- **User level:** Beginner — explain commands before running
- **Shop start:** `next start` (NOT `start:rest`) on port 3003
- **Admin start:** `next start -p 3002`
- **API start:** `node dist/main.js` on port 9000
- **Shop build must have API running** (Next.js fetches from API at build time)
- **LAN access:** Use `http://192.168.254.251:PORT` from other PCs on same network
- **Public access:** Use `https://switchgod.com.np`, `https://admin.switchgod.com.np`, `https://api.switchgod.com.np`
- **After .env changes:** Must rebuild affected service and restart PM2
- **VS Code / terminal:** Can be closed — PM2 runs as background daemon
- **Reboots:** PM2 auto-starts all services via systemd (`pm2 save` after any PM2 changes)

## Quick Reference
```bash
# Check all services
pm2 status

# Restart a service (after code changes)
pm2 restart shop

# Rebuild shop (API must be running)
cd /home/switchgod/Desktop/pickbazar/shop && npm run build:rest && pm2 restart shop

# Rebuild admin
cd /home/switchgod/Desktop/pickbazar/admin/rest && npm run build && pm2 restart admin

# Save PM2 process list (after changes)
pm2 save
```
