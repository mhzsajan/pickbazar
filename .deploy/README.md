# switchgod.com.np — PickBazar Deployment Project

> **AI CONTEXT FILE** — Read this first before doing anything. It contains the full picture of the project, what was done, what is pending, and where every file lives. Designed to minimize token usage on re-entry.

---

## 1. PROJECT IDENTITY

| Field | Value |
|---|---|
| **Project** | PickBazar e-commerce monorepo (v11.10.2 by RedQ) |
| **Owner** | switchgod |
| **Domain** | switchgod.com.np (on Cloudflare) |
| **Host machine** | Ubuntu 24.04 desktop, hostname `switchserver` |
| **Host user** | `switchgod` |
| **Project path on disk** | `/home/switchgod/Desktop/pickbazar/` |
| **Goal** | Self-hosted on local Ubuntu PC, exposed via Cloudflare Tunnel, CI/CD via GitHub |

---

## 2. REPO / MONOREPO STRUCTURE

```
pickbazar/
├── shop/          # Next.js 13.5 storefront (React 18, Tailwind, i18next)
├── admin/
│   └── rest/      # Admin dashboard — REST variant (Next.js 13.5)
├── api/
│   └── rest/      # Backend API — REST (NestJS, in-memory mock data, NO real DB)
├── admin/graphql/ # IGNORED — not used
├── api/graphql/   # IGNORED — not used
├── deployment/    # Original deployment docs (reference only)
├── RESUME.md           # AI reads this first — where we stopped
├── COMMANDS.md         # Working commands reference
├── SESSIONS.md         # What happened each session
└── .deploy/            # Scripts + full reference (hidden folder)
    ├── README.md       # This file — full project context
    ├── PLAN.md         # Master plan for UI/SEO/Mobile/Security/Bugs
    └── scripts/        # Deployment scripts
```

**We are using the REST variant only** (shop + admin/rest + api/rest). GraphQL variants are ignored.

**IMPORTANT:** We use **npm** (not yarn) for installing dependencies. Yarn v1 has a bulk-fetching bug that causes it to hang indefinitely on this machine. npm works but is slow (~17 min per service). Use `--legacy-peer-deps` flag.

---

## 3. SERVICES & PORTS

| Service | Folder | Port | PM2 Name | Public URL |
|---|---|---|---|---|
| REST API | `api/rest` | 9000 | `api` | `api.switchgod.com.np` |
| Shop (storefront) | `shop` | 3003 | `shop` | `switchgod.com.np` |
| Admin dashboard | `admin/rest` | 3002 | `admin` | `admin.switchgod.com.np` |
| Cloudflare Tunnel | - | - | `tunnel` | - |

All four run under **PM2** with auto-start on boot via systemd.

---

## 4. CURRENT STATUS — ALL DONE ✅

| Step | Status | Notes |
|---|---|---|
| Prerequisites installed | ✅ Done | Node 18, npm, git, PM2, cloudflared, gh CLI |
| Dependencies installed | ✅ Done | All 3 services (npm with --legacy-peer-deps) |
| .env files created | ✅ Done | All 3 with public domain URLs |
| Services built | ✅ Done | API, Shop, Admin all built |
| PM2 processes running | ✅ Done | api, shop, admin, tunnel — all online |
| PM2 auto-start on boot | ✅ Done | systemd + pm2 save |
| Git repo pushed | ✅ Done | mhzsajan/pickbazar (private) |
| Cloudflare Tunnel | ✅ Done | switchgod-tunnel, 3 DNS routes |
| Public URLs working | ✅ Done | switchgod.com.np, admin.*, api.* |
| Google Auth fixed | ✅ Done | GoogleProvider commented out (not configured) |
| API SHOP_URL fixed | ✅ Done | Set to https://switchgod.com.np |
| Font changed | ✅ Done | Google Sans Code (SIL Open Font License) |
| Dark mode | ❌ Reverted | Attempted, broke site, fully reverted (commit ed44c2b) |
| Documentation | ✅ Done | RESUME.md, SESSIONS.md, COMMANDS.md, .deploy/ |
| Master plan created | ✅ Done | .deploy/PLAN.md — 29 tasks across 6 phases |

---

## 5. ARCHITECTURE DIAGRAM

```
You (VS Code) ──git push──> GitHub repo (mhzsajan/pickbazar)
                                    │
                              GitHub Webhook (not yet set up)
                                    │
                        switchserver pulls + rebuilds
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
             shop :3003       admin :3002        api :9000
                  │                 │                 │
                  └─────────────────┴────── Cloudflare Tunnel ──> Internet
                                                          │
                                                switchgod.com.np
                                                admin.switchgod.com.np
                                                api.switchgod.com.np
```

---

## 6. ENVIRONMENT VARIABLES (current — public URLs)

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

**Note:** These are baked in at build time. If you change these, you must rebuild and restart.

---

## 7. THE PLAN

**File:** `.deploy/PLAN.md`

The master plan has 6 phases, 29 tasks total:

| Phase | Focus | Tasks |
|---|---|---|
| 1 — SEO | Google-friendly (sitemap, meta tags, structured data) | 6 |
| 2 — Security | Hacker-proof (headers, CORS, rate limiting) | 5 |
| 3 — Mobile | Mobile-friendly (navigation, forms, PWA) | 5 |
| 4 — Navigation | UI navigation (breadcrumbs, clean header, footer) | 5 |
| 5 — Bugs | Fix known bugs (error boundaries, unused fonts) | 5 |
| 6 — Performance | Speed optimization (lazy loading, bundle size) | 3 |

**Work through phases in order (1 → 6). Do NOT skip ahead.**

---

## 8. AI INSTRUCTIONS — HOW TO RESUME THIS PROJECT

When a user re-opens this project with an AI assistant:

1. **Read this file fully first.** Do not ask redundant questions already answered here.
2. **Read `.deploy/PLAN.md`** — this is the active work plan with 29 tasks.
3. **Read `RESUME.md`** — quick status of what's running.
4. Check Section 4 "Current Status" above — everything is deployed and running.
5. Find the first incomplete task in PLAN.md and continue from there.
6. The project folder on disk is `/home/switchgod/Desktop/pickbazar/`.
7. The user is a **beginner** — explain each command before running it.
8. **Use npm, not yarn.** Always use `npm install --legacy-peer-deps`.
9. After code changes: always `rm -rf .next` before rebuild to avoid stale cache.
10. **Do NOT push to GitHub until user sees changes on localhost and approves.**

---

## 9. PM2 COMMANDS

```bash
pm2 status              # Check all services
pm2 logs                # View all logs
pm2 logs shop           # View shop logs only
pm2 restart shop        # Restart shop
pm2 stop all            # Stop all
pm2 save                # Save process list (run after changes)
pm2 startup             # Auto-start on boot (requires sudo)
```

---

## 10. REBUILD COMMANDS

```bash
# Clear cache + rebuild shop (API must be running)
cd /home/switchgod/Desktop/pickbazar/shop && rm -rf .next && npx next build && pm2 restart shop

# Rebuild admin
cd /home/switchgod/Desktop/pickbazar/admin/rest && rm -rf .next && npx next build && pm2 restart admin

# Rebuild API
cd /home/switchgod/Desktop/pickbazar/api/rest && npx nest build && pm2 restart api
```

---

## 11. KNOWN ISSUES

| Issue | Status | Notes |
|---|---|---|
| Yarn hangs on "Fetching packages..." | Known | Use npm instead |
| Google OAuth not configured | By design | GoogleProvider commented out in [...nextauth].ts |
| Dark mode broken | Reverted | Tried and fully reverted (commit ed44c2b) |
| ESLint/TS errors ignored in build | TODO | See PLAN.md Phase 5 |
| Sitemap has localhost URLs | TODO | See PLAN.md Phase 1 |
| No security headers | TODO | See PLAN.md Phase 2 |

---

*Created: Session 2 — Steps 1-2 complete*
*Last updated: Session 7 — All services deployed, plan created*
