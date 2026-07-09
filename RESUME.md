# RESUME — Read This First

## 🛟 Safety Net — Restore Point
- **Tag:** `v1.0-20260629-0926` (created 2026-06-29 09:26 NPT, commit `bbbfc91`)
- **Branch:** `backup-pre-customization` (pushed to origin)
- **What's saved:** All 22 sessions complete — dark blue theme, dark mode toggle, mobile audit, Phase 10 UI fixes
- **Restore command:** `git reset --hard v1.0-20260629-0926`
- **Backup branch (safer):** `git checkout -b broken-work && git checkout -f v1.0-20260629-0926`

---

## Where We Stopped
- **Last completed:** Session 33 — Color scheme consistency audit
- **Current step:** Fixed `bg-gray-100`/`bg-gray-200` → `bg-surface`/`bg-light` across ~45 files for consistent dark mode backgrounds. Replaced hardcoded hex borders and bg colors with CSS var classes. Added `<meta name="color-scheme">`. All 3 services running.
- **Master plan:** `.deploy/PLAN.md` — tasks across 12 phases

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
- Dark mode: Toggle in header, localStorage persistence, CSS variable switching, SSR flash prevention
- Surface color: Cards/sections blend with background (rgb(243,244,246) light / rgb(16,18,45) dark
- Mobile: All 67 audit issues fixed (Phase 8)
- Modal UX: Close button, back button, swipe-to-go-back — all working
- Add-to-cart: ⚠️ Issues found, code reverted, root causes documented
- Dark mode UI fixes: text-light→text-white on colored backgrounds (44 files), Alert/notification/spinner/skeleton/counter/radio fixes, text-muted-black eliminated (6 files), hardcoded hex colors converted to CSS variables, banner overlays added
- Animations: Seven-layer canvas (moon → orbs → sigils → gears → constellation → wisps → streaks), scroll reveals, card hover — see `.deploy/ANIMATIONS.md`
- Theme: Phase 10 dark mode visual fixes — 37 tasks completed
- Color scheme consistency: Fixed `bg-gray-100`/`bg-gray-200` → `bg-surface`/`bg-light` across ~45 files, replaced hardcoded hex borders (`border-[#D4D8DD]` → `border-border-base`) and bg colors (`bg-[#e6e5eb]`, `bg-[#F1F1F1]`, `bg-slate-*`), added `<meta name="color-scheme">` to `_document.tsx`

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
