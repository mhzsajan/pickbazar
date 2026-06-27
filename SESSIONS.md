# SESSIONS — What Happened Each Session

<!-- !! FOR AI: Update this file after EVERY step. Add what was done, what worked, what failed, and any new lessons learned. This prevents repeating mistakes. !! -->

## Session 1 (Before This Conversation)
- Created `scripts/setup-prereqs.sh` — installs Node 18, yarn, git, PM2, cloudflared, gh CLI
- Created `switchgod-project/README.md` with full project context
- **Nothing was actually installed** — script was ready but not run yet

---

## Session 2 (This Conversation)

### What Happened
1. Read and understood the full project (PickBazar e-commerce monorepo)
2. Verified prerequisites were already installed on the machine
3. Created `.env` files for all 3 services with localhost URLs
4. Tried `yarn install` — **FAILED** (hung indefinitely on "Fetching packages...")
5. Tried `npm install` — worked but slow (~17 min per service)
6. Installed all 3 services successfully
7. Built and tested API — works on port 9000
8. Found and fixed duplicate `admin/node_modules` (794MB wasted)
9. Cleaned up lockfile conflicts (removed yarn.lock from api/rest)
10. Cleaned `admin/package.json` to remove workspaces section
11. Updated README.md with full current state

### What Was Created
- `api/rest/.env`
- `shop/.env.local`
- `admin/rest/.env.local`
- `RESUME.md` (this conversation)
- `SESSIONS.md` (this file)
- `COMMANDS.md` (working commands reference)

### What Was Cleaned Up
- Deleted `admin/node_modules` (duplicate, saved 794MB)
- Removed `api/rest/yarn.lock` (we use npm)
- Removed `admin/package-lock.json` (invalid from old workspace install)
- Removed workspaces from `admin/package.json`

### Problems Encountered
| Problem | Solution |
|---------|----------|
| Yarn hangs on "Fetching packages..." | Switched to npm with `--legacy-peer-deps` |
| npm install takes ~17 min per service | Normal for this project, run in background |
| admin/node_modules duplicated (794MB) | Deleted duplicate, kept admin/rest only |
| admin/rest has no lockfile | Copied from admin/ level, works but not reproducible |
| api/rest had both yarn.lock and package-lock.json | Removed yarn.lock |
| Other PCs couldn't access services | Changed localhost to 192.168.254.251 in .env.local files and rebuilt |
| Frontend shows "network error" after 3-5 sec on other PC | `NEXT_PUBLIC_*` vars baked at build time — rebuild was required |

### Commands That Actually Worked
```bash
# Install (per service)
npm install --legacy-peer-deps
npm install --legacy-peer-deps --maxsockets=2  # slower but uses less memory

# Build API
npx nest build

# Run API
node dist/main.js
```

### Commands That Failed
```bash
yarn install  # HANGS indefinitely
yarn install --network-concurrency 4  # STILL HANGS
yarn install --ignore-optional  # STILL HANGS
npm install --legacy-peer-deps --ignore-workspaces  # Detects workspace root anyway
```

---

## Session 3 (Next)
**Goal:** Build shop & admin, verify all 3 services run on localhost

---

## Session 3 (This Conversation)
1. Fixed API start script: `dev:rest` doesn't exist, correct script is `start:dev` or run `node dist/main.js` directly
2. Started API via `node dist/main.js` — it kept dying when bash session ended
3. Used PM2 to keep API alive: `pm2 start dist/main.js --name api`
4. Built shop: `npm run build:rest` — succeeded (API must be running during build)
5. Built admin: `npm run build` — succeeded
6. Started shop via PM2: `pm2 start npm --name shop --cwd .../shop -- run start -- -p 3003`
7. Started admin via PM2: `pm2 start npm --name admin --cwd .../admin/rest -- run start -- -p 3002`
8. Verified all 3 services respond correctly
9. Updated RESUME.md, COMMANDS.md, SESSIONS.md
10. Fixed LAN access: changed `localhost` to `192.168.254.251` in shop/.env.local and admin/rest/.env.local
11. Rebuilt shop and admin with new IP, restarted PM2 processes
12. Verified sites work from another PC (192.168.254.250) on same network

### What We Learned
- Shop's `start` script has no `:rest` variant (only build does)
- API must be running during `npm run build:rest` (Next.js fetches from API at build time)
- PM2 keeps processes alive across sessions
- Shop runs on :3003, Admin on :3002, API on :9000

### PM2 Processes (Current State)
| Name | Port | Status |
|------|------|--------|
| api | 9000 | online |
| shop | 3003 | online |
| admin | 3002 | online |

### Network Access
- **This PC:** `http://localhost:PORT`
- **Other PCs:** `http://192.168.254.251:PORT`
- API URLs baked into frontend at build time via `NEXT_PUBLIC_REST_API_ENDPOINT`
- After Cloudflare Tunnel, will use domain names instead

---

## Session 4 (Next)
**Goal:** Initialize git, create GitHub repo, push code
