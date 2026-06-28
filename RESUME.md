# RESUME — Read This First

## Where We Stopped
- **Last completed:** Session 19 — Dark mode toggle, surface color, removed banners, fixed search boxes
- **Current step:** Dark mode toggle working. Phase 1 remaining — logo, favicon, content
- **Next action:** Phase 1 remaining — replace logo, favicon, banner images, footer content at `.deploy/PLAN.md`
- **Master plan:** `.deploy/PLAN.md` — 112 tasks across 9 phases (Phase 8 = 67 mobile audit tasks done)

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
- Git: mhzsajan/pickbazar (private)
- Public URLs: switchgod.com.np, admin.switchgod.com.np, api.switchgod.com.np
- Font: Google Sans Code (SIL Open Font License)
- Theme: Dark blue (Midjourney-style #06051d), green accent
- Dark mode: Toggle in header, localStorage persistence, CSS variable switching
- Surface color: Cards/sections blend with background (rgb(243,244,246) light / rgb(16,18,45) dark)
- Mobile: All 67 audit issues fixed (Phase 8)
- Modal UX: Close button, back button, swipe-to-go-back — all working
- Add-to-cart: ⚠️ Issues found, code reverted, root causes documented

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
