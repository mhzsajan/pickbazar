# switchgod.com.np — PickBazar Deployment Project

> **AI CONTEXT FILE** — Read this first. Full project context, services, architecture, and instructions.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Project** | PickBazar e-commerce monorepo (v11.10.2 by RedQ) |
| **Owner** | switchgod |
| **Domain** | switchgod.com.np (Cloudflare) |
| **Host** | Ubuntu 24.04 desktop, hostname `switchserver` |
| **Path** | `/home/switchgod/Desktop/pickbazar/` |
| **Goal** | Self-hosted, exposed via Cloudflare Tunnel |

---

## 2. Monorepo Structure

```
pickbazar/
├── shop/           # Next.js 13.5 storefront (React 18, Tailwind) → port 3003
├── admin/rest/     # Admin dashboard (Next.js 13.5) → port 3002
├── api/rest/       # Backend API (NestJS, in-memory mock data) → port 9000
├── .deploy/        # This folder — scripts, plan, audit, context
│   ├── README.md   # This file
│   ├── PLAN.md     # Master plan (112 tasks across 9 phases)
│   ├── AUDIT.md    # Mobile audit (67 issues, all fixed)
│   └── KNOWN_ISSUES.md  # Bugs, root causes, what NOT to try
└── deployment/     # Original deployment docs (reference only)
```

**We use REST only** (shop + admin/rest + api/rest). GraphQL variants ignored.

---

## 3. Services

| Service | Folder | Port | PM2 | Public URL |
|---------|--------|------|-----|------------|
| API | `api/rest` | 9000 | `api` | api.switchgod.com.np |
| Shop | `shop` | 3003 | `shop` | switchgod.com.np |
| Admin | `admin/rest` | 3002 | `admin` | admin.switchgod.com.np |
| Tunnel | — | — | `tunnel` | — |

All run under PM2 with auto-start on boot (systemd).

---

## 4. Current Status

| Step | Status |
|------|--------|
| Prerequisites installed | ✅ Node 18, npm, git, PM2, cloudflared, gh |
| Dependencies installed | ✅ All 3 (npm + --legacy-peer-deps) |
| .env files created | ✅ All 3 with public domain URLs |
| Services built | ✅ API, Shop, Admin |
| PM2 running | ✅ api, shop, admin, tunnel |
| PM2 auto-start | ✅ systemd + pm2 save |
| Git pushed | ✅ mhzsajan/pickbazar (private) |
| Cloudflare Tunnel | ✅ switchgod-tunnel, 3 DNS routes |
| Public URLs | ✅ switchgod.com.np, admin.*, api.* |
| Font | ✅ Google Sans Code (SIL Open Font License) |
| Theme | ✅ Dark blue (Midjourney-style #06051d), green accent |
| Mobile audit | ✅ 67/67 issues fixed (Phase 8) |
| Modal UX | ✅ Close button, back button, swipe-to-go-back |
| Dark theme | ✅ Applied across 100+ files, text visibility fixed |
| Add-to-cart | ⚠️ Reverted, root causes in KNOWN_ISSUES.md |
| Dark mode visual audit | ✅ Phase 10 complete — 37 UI fixes across 80+ files |
| Theme infrastructure | ✅ SSR flash prevention, darkMode class config, theme toggle targeting `<html>` |

---

## 5. Architecture

```
You (VS Code) ──git push──> GitHub (mhzsajan/pickbazar)
                                    │
                              GitHub Webhook (not set up)
                                    │
                        switchserver pulls + rebuilds
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
             shop :3003       admin :3002        api :9000
                  │                 │                 │
                  └─────────────────┴── Cloudflare Tunnel ──> Internet
                                                         │
                                               switchgod.com.np
                                               admin.switchgod.com.np
                                               api.switchgod.com.np
```

---

## 6. Environment Variables

### api/rest/.env
```env
APP_NAME=PickBazar
PORT=9000
DEFAULT_CURRENCY=USD
SHOP_URL=https://switchgod.com.np
```

### shop/.env.local
```env
FRAMEWORK_PROVIDER="rest"
NEXT_PUBLIC_REST_API_ENDPOINT="https://api.switchgod.com.np/api"
APPLICATION_MODE=production
NEXT_PUBLIC_ADMIN_URL="https://admin.switchgod.com.np"
NEXTAUTH_URL=https://switchgod.com.np
SECRET=your-secret-key-change-this
NEXT_PUBLIC_SITE_URL=https://switchgod.com.np
NEXT_PUBLIC_VERSION=11.10.2
```

### admin/rest/.env.local
```env
NEXT_PUBLIC_REST_API_ENDPOINT="https://api.switchgod.com.np/api"
NEXT_PUBLIC_SHOP_URL="https://switchgod.com.np"
APPLICATION_MODE=production
NEXT_PUBLIC_VERSION=11.10.2
```

**Note:** These are baked in at build time. Change = rebuild + restart.

---

## 7. AI Instructions — How to Resume

1. Read `RESUME.md` first — where we stopped, rules, commands
2. Read this file — full project context
3. Read `.deploy/PLAN.md` — active work plan (149 tasks across 10 phases)
4. Read `.deploy/KNOWN_ISSUES.md` — bugs and root causes
5. Find first incomplete task in PLAN.md and continue
6. **npm, not yarn** — always `npm install --legacy-peer-deps`
7. After changes: `rm -rf .next` before rebuild
8. Don't push until user approves on localhost
9. User is beginner — explain commands before running

---

## 8. Backup & Restore

### Restore Points
| Tag | Date | Commit | What's Saved |
|-----|------|--------|-------------|
| `v1.0-20260629-0926` | 2026-06-29 | `bbbfc91` | All sessions 1-23, Phase 10 complete, pre-customization |

### Restore Commands
```bash
# HARD restore — overwrites everything (use with caution)
git fetch --tags
git reset --hard v1.0-20260629-0926
git push --force

# SAFER restore — saves current work in a branch first
git branch broken-experiment
git checkout -f v1.0-20260629-0926
```

### Backup Branch
`origin/backup-pre-customization` — exact copy of main at restore point. Can checkout as:
```bash
git checkout -b my-working-copy origin/backup-pre-customization
```

---

## 9. Commands

```bash
# PM2
pm2 status
pm2 restart shop
pm2 save

# Rebuild shop (API must be running)
cd /home/switchgod/Desktop/pickbazar/shop && rm -rf .next && npm run build:rest && pm2 restart shop

# Rebuild admin
cd /home/switchgod/Desktop/pickbazar/admin/rest && rm -rf .next && npx next build && pm2 restart admin

# Rebuild API
cd /home/switchgod/Desktop/pickbazar/api/rest && npx nest build && pm2 restart api
```

---

*Created: Session 2 — June 27, 2026*
*Last updated: Session 23 — June 29, 2026*
