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
    ├── README.md       # Full project context
    └── scripts/        # Deployment scripts
```

**We are using the REST variant only** (shop + admin/rest + api/rest). GraphQL variants are ignored.

**IMPORTANT:** We use **npm** (not yarn) for installing dependencies. Yarn v1 has a bulk-fetching bug that causes it to hang indefinitely on this machine. npm works but is slow (~17 min per service). Use `--legacy-peer-deps` flag.

---

## 3. SERVICES & PORTS

| Service | Folder | Port | Public URL |
|---|---|---|---|
| REST API | `api/rest` | 9000 | `api.switchgod.com.np` |
| Shop (storefront) | `shop` | 3003 | `switchgod.com.np` |
| Admin dashboard | `admin/rest` | 3002 | `admin.switchgod.com.np` |

All three must run simultaneously. They will be managed by **PM2**.

---

## 4. ARCHITECTURE DIAGRAM

```
You (VS Code) ──git push──> GitHub repo
                                │
                          GitHub Webhook
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

**Local edit → push to GitHub → webhook fires on server → auto pull + rebuild → live on domain.**

---

## 5. SYSTEM STATE

### Machine specs
- OS: Ubuntu 24.04 LTS (kernel 6.17.0-35-generic)
- RAM: 11 GB total, ~7 GB available
- Disk: 81 GB free on `/home`
- Swap: 8 GB

### Prerequisites installed ✅
- Node.js 18.20.8
- npm 10.8.2
- yarn 1.22.22 (installed but **not used** — see yarn bug note below)
- git 2.43.0
- PM2 7.0.1
- cloudflared 2026.6.1
- GitHub CLI (gh) 2.45.0

### Dependencies installed ✅
- `api/rest/node_modules` — 483 packages, 350MB
- `shop/node_modules` — 777 packages, 644MB
- `admin/rest/node_modules` — 656 packages, 794MB
- Total project size on disk: ~1.9GB

### .env files created ✅
- `api/rest/.env` — PORT=9000, localhost URLs
- `shop/.env.local` — points to localhost:9000 (API) and localhost:3002 (admin)
- `admin/rest/.env.local` — points to localhost:9000 (API) and localhost:3003 (shop)

### API built & tested ✅
- `api/rest/dist/` exists — NestJS build successful
- API starts on port 9000, responds to requests

### NOT done yet
- Shop and Admin Next.js builds (`.next` folder missing for both)
- Git init — no `.git` folder yet
- GitHub repo — not created yet
- Cloudflare Tunnel — not created yet
- PM2 setup — installed but no processes configured
- Auto-deploy webhook — not created yet

---

## 6. STEP-BY-STEP PLAN (full roadmap)

| # | Step | Status | Notes |
|---|---|---|---|
| 1 | Install prerequisites (Node 18, npm, git, PM2, cloudflared, gh CLI) | **DONE** ✅ | All installed |
| 2 | Install project dependencies & set up `.env` files | **DONE** ✅ | Used npm with `--legacy-peer-deps`. Yarn hangs due to bug. |
| 3 | Build & run all 3 services locally, verify on localhost | **IN PROGRESS** ⚠️ | API works. Shop & Admin need `next build` then `next start`. |
| 4 | Git init + create GitHub repo + push code | **PENDING** | |
| 5 | Set up Cloudflare Tunnel with 3 subdomains | **PENDING** | See Section 9 |
| 6 | Switch `.env` to public URLs & rebuild | **PENDING** | Must do AFTER tunnel is live |
| 7 | PM2 process management + auto-start on reboot | **PENDING** | See Section 10 |
| 8 | Auto-deploy: GitHub webhook → pull → rebuild → restart | **PENDING** | |

---

## 7. SCRIPTS IN THIS FOLDER

| File | Purpose | Status |
|---|---|---|
| `scripts/setup-prereqs.sh` | Installs Node 18, yarn, git, PM2, cloudflared, gh CLI | READY (already used) |
| `scripts/setup-env.sh` | Writes `.env` files for all 3 services | NOT NEEDED — created manually |
| `scripts/install-deps.sh` | Installs npm dependencies | NOT NEEDED — done manually |
| `scripts/build-all.sh` | Builds shop, admin, api | TO BE CREATED in Step 3 |
| `scripts/pm2-start.sh` | Starts all 3 services under PM2 | TO BE CREATED in Step 7 |
| `scripts/cloudflare-tunnel.sh` | Creates tunnel + DNS routes | TO BE CREATED in Step 5 |
| `scripts/webhook-server.js` | Auto-deploy listener for GitHub webhooks | TO BE CREATED in Step 8 |

---

## 8. ENVIRONMENT VARIABLES (current values — localhost)

### api/rest/.env
```env
APP_NAME=PickBazar
PORT=9000
DEFAULT_CURRENCY=USD
SHOP_URL=http://localhost:3003
STRIPE_API_KEY=
PAYPAL_MODE=sandbox
PAYPAL_SANDBOX_CLIENT_ID=
PAYPAL_SANDBOX_CLIENT_SECRET=
PAYPAL_LIVE_CLIENT_ID=
PAYPAL_LIVE_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
```

### shop/.env.local
```env
FRAMEWORK_PROVIDER="rest"
NEXT_PUBLIC_REST_API_ENDPOINT="http://localhost:9000/api"
APPLICATION_MODE=production
NEXT_PUBLIC_ADMIN_URL="http://localhost:3002"
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_ENABLE_MULTI_LANG=false
NEXT_PUBLIC_AVAILABLE_LANGUAGES=en
NEXTAUTH_URL=http://localhost:3003
SECRET=your-secret-key-change-this
NEXT_PUBLIC_VERSION=11.10.2
```

### admin/rest/.env.local
```env
NEXT_PUBLIC_REST_API_ENDPOINT="http://localhost:9000/api"
NEXT_PUBLIC_SHOP_URL="http://localhost:3003"
APPLICATION_MODE=production
NEXT_PUBLIC_AUTH_TOKEN_KEY=AUTH_CRED
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_ENABLE_MULTI_LANG=false
NEXT_PUBLIC_AVAILABLE_LANGUAGES=en
NEXT_PUBLIC_API_BROADCAST_DRIVER=log
NEXT_PUBLIC_VERSION=11.10.2
```

**Important:** These are localhost URLs for Step 3 (local testing). In Step 6, switch to public URLs.

---

## 9. CLOUDFLARE TUNNEL PLAN

Domain `switchgod.com.np` is already on Cloudflare. The tunnel routes public traffic to local ports without opening router ports.

```
switchgod.com.np        → localhost:3003   (shop)
admin.switchgod.com.np  → localhost:3002   (admin)
api.switchgod.com.np    → localhost:9000   (api)
```

Steps (to be done in Step 5):
1. `cloudflared tunnel login` — opens browser, authenticate with Cloudflare account
2. `cloudflared tunnel create switchgod-tunnel`
3. Write `~/.cloudflared/config.yml` with the 3 ingress rules
4. `cloudflared tunnel route dns switchgod-tunnel switchgod.com.np`
5. Repeat for admin and api subdomains
6. `cloudflared tunnel run switchgod-tunnel` (then hand off to PM2)

---

## 10. PM2 PROCESS NAMES

When PM2 is set up, processes will be named:
- `pickbazar-api` — api/rest (port 9000)
- `pickbazar-shop` — shop (port 3003)
- `pickbazar-admin` — admin/rest (port 3002)
- `cloudflare-tunnel` — cloudflared tunnel run

---

## 11. HOW TO RESUME THIS PROJECT (AI INSTRUCTIONS)

When a user re-opens this project with an AI assistant:

1. **Read this README fully first.** Do not ask redundant questions already answered here.
2. Check Section 5 "System State" — understand what is already installed/done.
3. Check Section 6 "Step-by-Step Plan" — find the first PENDING step and continue from there.
4. Check `scripts/` folder for existing scripts before writing new ones.
5. The project folder on disk is `/home/switchgod/Desktop/pickbazar/`.
6. Always prefer writing scripts to `/home/switchgod/Desktop/pickbazar/.deploy/scripts/` so the user can keep them.
7. The user is a **beginner** — explain each command before running it. Do not assume knowledge of Node, git, Linux, or Cloudflare.
8. Ask for `sudo` password via a script the user runs manually — do not try to pipe it.
9. **Use npm, not yarn.** Yarn v1 has a bulk-fetching bug on this machine that causes indefinite hangs during "Fetching packages..." step. Always use `npm install --legacy-peer-deps` instead of `yarn install`.
10. Installing npm packages is SLOW (~17 minutes per service). Run in background and check periodically.

---

## 12. KEY DECISIONS MADE

| Decision | Reason |
|---|---|
| REST variant only (not GraphQL) | Simpler for first deployment |
| No database needed | api/rest uses in-memory mock data |
| Node.js 18 LTS | Compatible with Next.js 13.5 in this project |
| Cloudflare Tunnel (not port forwarding) | Cleaner, no router config, free, secure |
| PM2 for process management | Auto-restart on crash + startup on reboot |
| GitHub webhook for auto-deploy | Edit in VS Code → push → live on domain automatically |
| **npm (not yarn)** | Yarn v1 has bulk-fetching bug on this machine — hangs indefinitely |
| `--legacy-peer-deps` flag | Required because some packages have peer dep conflicts with React 18 |

---

## 13. USEFUL COMMANDS (quick reference)

```bash
# Check service status
pm2 status

# View logs
pm2 logs pickbazar-shop
pm2 logs pickbazar-api
pm2 logs pickbazar-admin

# Restart a service
pm2 restart pickbazar-shop

# Check cloudflared tunnel
pm2 logs cloudflare-tunnel

# Manual git pull + rebuild (before webhook is set up)
cd /home/switchgod/Desktop/pickbazar
git pull
cd api/rest && npm run build && pm2 restart pickbazar-api
cd ../../shop && npm run build && pm2 restart pickbazar-shop
cd ../admin/rest && npm run build && pm2 restart pickbazar-admin
```

---

## 14. KNOWN ISSUES & TROUBLESHOOTING

### Yarn hangs on "Fetching packages..."
Yarn v1 has a known bug where bulk package downloading gets stuck indefinitely on this machine, even though individual downloads work fine (0.14s per package). The resolution phase (step 1/4) completes, but fetching (step 2/4) never finishes.
**Solution:** Use npm instead: `npm install --legacy-peer-deps`

### admin/rest has no lockfile
`admin/rest/node_modules` was installed at `admin/` level (because `admin/package.json` had workspaces), then copied to `admin/rest/`. The `admin/package.json` workspaces section was removed to prevent this from happening again. If you need to reinstall admin/rest, run `npm install --legacy-peer-deps` inside `admin/rest/`.

### npm install is very slow (~17 min)
This is normal for this project. The shop has 80+ direct dependencies with hundreds of transitive deps. Use `--maxsockets=2` to limit connections if needed. Run in background with `nohup`.

---

*Last updated: Session 2 — Steps 1-2 complete, Step 3 in progress.*
