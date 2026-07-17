# RESUME — Read This First

## Where We Stopped
- **Last completed:** Session 38 — Shops + Products persistence fixes
- **Current step:** Shops and products can now be created/updated/deleted via admin. Data persists to JSON files.
- **Next action:** Continue Phase 10 — fix Orders, Coupons, Users, Auth, then remaining services
- **Dark mode backup:** Tag `v2.0-dark-mode-full`, branch `backup-dark-mode-full` (pushed to origin)

## What Works Now
| Service | Port | PM2 | Status | Domain |
|---------|------|-----|--------|--------|
| API | 9000 | api | Running | api.switchgod.com.np |
| Shop | 3003 | shop | Running | switchgod.com.np |
| Admin | 3002 | admin | Running | admin.switchgod.com.np |
| Tunnel | — | tunnel | Running | — |

## Quick Status
- Prerequisites: Node 18, npm, git, PM2, cloudflared, gh CLI
- Build: All 3 services built and running via PM2
- PM2 auto-start: Configured via systemd
- Git: mhzsajan/pickbazar (private) — `main` reset to `ace8c18` (force pushed)
- Public URLs: switchgod.com.np, admin.switchgod.com.np, api.switchgod.com.np
- Font: Google Sans Code (SIL Open Font License)
- Mobile: All 67 audit issues fixed (Phase 8)
- Modal UX: Close button, back button, swipe-to-go-back — all working
- Add-to-cart: ⚠️ Issues found, code reverted, root causes documented
- Settings persistence: ✅ API now persists settings changes to `settings.json` (Session 36 fix)
- Currency: ✅ Set to NPR via Admin Dashboard (Nepalese Rupee)
- **API persistence (shops):** ✅ Shops — create/update/approve/disapprove/remove all persist to `shops.json`
- **API persistence (products):** ✅ Products — create/update/remove all persist to `products.json`
- **API persistence (other):** ❌ Orders, coupons, users, auth, categories, etc. still broken — Phase 10 ongoing
- Theme: Pure light mode only — NO dark mode, NO dark toggle, NO canvas animations
- Dark mode backup: `git checkout v2.0-dark-mode-full` to restore full dark mode state

## Rules
- **npm, NOT yarn** (yarn hangs). Always `npm install --legacy-peer-deps`
- **After changes:** `rm -rf .next` before rebuild
- **Don't push** until user approves on localhost
- **Beginner user** — explain commands before running
- **Shop:** `next start` on port 3003. **Admin:** `next start -p 3002`. **API:** `node dist/main.js` on port 9000
- **API must be running** when building shop (Next.js fetches from API at build time)
- **VS Code can be closed** — PM2 runs as background daemon

## Commands
```bash
pm2 status                    # Check all services
pm2 restart shop              # Restart a service
pm2 save                      # Save process list

# Rebuild shop (API must be running)
cd /home/switchgod/Desktop/pickbazar/shop && rm -rf .next && npm run build:rest && pm2 restart shop

# Rebuild admin
cd /home/switchgod/Desktop/pickbazar/admin/rest && rm -rf .next && npx next build && pm2 restart admin

# Rebuild API
cd /home/switchgod/Desktop/pickbazar/api/rest && npx nest build && pm2 restart api
```
