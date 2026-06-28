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

## Session 4 (This Conversation)
1. Logged in to GitHub CLI (user: mhzsajan)
2. Created .gitignore fix (/.next/ → .next/)
3. Committed all files: "Initial commit: PickBazar e-commerce"
4. Created private GitHub repo: https://github.com/mhzsajan/pickbazar
5. Pushed code to main branch
6. Restarted all 3 PM2 services (daemon was fresh)

---

## Session 5 (This Conversation)
1. Authenticated with Cloudflare via `cloudflared tunnel login`
2. Created tunnel `switchgod-tunnel` (fcdc4b48-24b7-4d03-a570-d1c148c94bfb)
3. Deleted old tunnels (`pickbazar`, `switchgod`) that had stale DNS records
4. User deleted old DNS CNAME records in Cloudflare dashboard
5. Routed DNS: switchgod.com.np, admin.switchgod.com.np, api.switchgod.com.np → tunnel
6. Created tunnel config at ~/.cloudflared/config.yml
7. Started tunnel via PM2
8. Updated .env.local files to use domain URLs
9. Rebuilt shop and admin with domain URLs
10. Verified all 3 domains return 200/307
11. Saved PM2 process list

### Lesson Learned
- Old DNS CNAME records block new tunnel routing — must delete them first
- Build must happen AFTER tunnel DNS is working (Next.js fetches API at build time)
- Deleted old Cloudflare tunnels don't auto-delete their DNS records

---

## Session 6 (This Conversation)
1. Audited PM2 logs — found `GOOGLE_CLIENT_ID` error in shop logs
2. Commented out GoogleProvider in `shop/src/pages/api/auth/[...nextauth].ts` (not configured)
3. Updated API `SHOP_URL` to public domain in `api/rest/.env`
4. Rebuilt shop, restarted shop and API
5. Verified no new errors in logs
6. Verified all 3 tunnel URLs still working (200, 307, 200)
7. Fixed documentation inconsistencies across RESUME.md, SESSIONS.md, COMMANDS.md
8. Configured PM2 auto-start on boot via systemd (`pm2 startup` + `pm2 save`)

### Issues Found & Fixed
| Issue | Fix |
|-------|-----|
| `GOOGLE_CLIENT_ID` error in shop logs | Commented out GoogleProvider (not configured) |
| API `SHOP_URL` was localhost | Changed to `https://switchgod.com.np` |
| RESUME.md referenced old LAN IP | Updated to domain URLs |
| COMMANDS.md had wrong GitHub URL | Fixed to mhzsajan/pickbazar |
| SESSIONS.md had duplicate "Session 3" header | Removed duplicate |

---

## Session 7 (This Conversation)
1. Added Google Sans Code font via Fontsource CDN
2. Updated `_document.tsx` with Fontsource link tag
3. Updated `tailwind.config.js` font family to `'Google Sans Code Variable', 'monospace'`
4. Cleared .next cache and rebuilt shop
5. Restarted PM2 shop service

### Font Info
- **Font:** Google Sans Code (monospace variant of Google Sans)
- **License:** SIL Open Font License (OFL) — free for personal and commercial use
- **CDN:** Fontsource (`@fontsource/google-sans-code`)
- **Files changed:** `shop/src/pages/_document.tsx`, `shop/tailwind.config.js`

---

## Session 8 (This Conversation)
1. Created master plan at `.deploy/PLAN.md` — 29 tasks across 6 phases
2. Updated `.deploy/README.md` to reflect current state (all services deployed)
3. Updated `RESUME.md` with plan reference
4. Updated `deployment/README.md` with link to `.deploy/`
5. Pushed all changes to GitHub for backup

---

## Session 9 (This Conversation)
1. Fixed homepage footer — was not showing (changed `min-h-screen` to `flex-grow` in `_home.tsx`)
2. Fixed Footer import bug in `layout.tsx` (was importing checkmark icon instead of real footer)
3. Removed "Shops" link from header nav (homepage IS the shops page)
4. Added top padding to homepage shops section (`pt-24`) so it's not stuck at the top
5. Reduced footer top spacing from `pt-16 lg:pt-24` to `pt-8 lg:pt-10`
6. Full footer visual audit — fixed 8 issues:
   - Conflicting border colors (`border-gray-800` + `border-t-border-100`)
   - Removed thick bottom border (`lg:border-b-8`)
   - Fixed uneven contact column spacing (used `space-y-3`)
   - Fixed menu heading spacing (`mb-5` consistent)
   - Fixed subscription widget spacing (matched `mb-5`)
   - Fixed bottom section padding (was `pb-20 mt-8`, now `py-6`)
   - Fixed payment icon sizing (removed `text-5xl`)
   - Removed ~30 lines of commented-out dead code
   - Simplified grid from 3 conflicting strategies to clean responsive columns
7. Updated SESSIONS.md, PLAN.md, RESUME.md with all changes
8. Pushed to GitHub

---

## Session 10 (This Conversation)
1. Removed "Offers" and "Become a Seller" from header links (green button stays — it's hardcoded in header component)
2. Reordered header links so Manufacturers and Authors appear in "Pages" dropdown
3. Final header layout: Contact, Flash Sale, Help (direct) + Pages dropdown (Manufacturers, Authors, Terms, Refund Policies)
4. Updated SESSIONS.md and RESUME.md
5. Pushed to GitHub

---

## Session 11 (This Conversation)
1. Full header visual audit — identified 8 issues
2. Removed ~50 lines of dead commented-out code (old language switcher, map button, second row, responsive logic)
3. Standardized spacing: `space-x-5` / `2xl:space-x-7` across menu and icons
4. Added `overflow-hidden` to logo container to prevent overflow
5. Removed `transform-gpu` (potential rendering issues)
6. Cleared cache, rebuilt shop, restarted PM2
7. Updated SESSIONS.md and RESUME.md
8. Pushed to GitHub

---

## Session 12 (This Conversation)
1. Verified header and footer fixes from Sessions 9-11 — confirmed all changes are in place
2. Full mobile visual/UX audit — found 67 issues across the shop frontend
3. Created `.deploy/AUDIT.md` — comprehensive audit document with all findings, file paths, and line numbers
4. Updated `.deploy/PLAN.md` — added Phase 8 with 67 tasks organized by category (touch targets, overlaps, broken features, text size, z-index, spacing, responsive, dead code)
5. Updated RESUME.md with current status
6. Updated SESSIONS.md with Session 12

### Audit Findings Summary
| Priority | Category | Count |
|----------|----------|-------|
| HIGH | Touch targets < 44px | 10 |
| HIGH | Fixed elements overlapping | 4 |
| HIGH | Mobile broken features | 5 |
| MEDIUM | Small text | 7 |
| MEDIUM | Z-index conflicts | 5 |
| MEDIUM | Spacing/layout issues | 9 |
| MEDIUM | Missing responsive classes | 3 |
| MEDIUM | Conflicting click handlers | 3 |
| MEDIUM | Touch target borderline | 2 |
| LOW | Dead/commented-out code | 14 |
| LOW | Deprecated/minor | 5 |
| **TOTAL** | | **67** |

### Key Files Created/Updated
- `.deploy/AUDIT.md` — Full audit with 67 findings (file paths + line numbers)
- `.deploy/PLAN.md` — Added Phase 8 (67 mobile fix tasks)
- `RESUME.md` — Updated current status
- `SESSIONS.md` — Session 12 record

### Next Steps
- Fix HIGH priority issues first (touch targets, overlaps, broken mobile features)
- Then MEDIUM priority (text size, z-index, spacing)
- Then LOW priority (dead code cleanup)

---

## Session 13 (This Conversation)
1. Fixed all 19 HIGH priority mobile issues from audit:
   - **Touch targets (H1-H10):** Changed `h-7 w-7` (28px) to `h-11 w-11` (44px) in:
     - Product cards: argon.tsx, xenon.tsx, neon.tsx
     - Add-to-cart button: add-to-cart-btn.tsx (neon, argon, oganesson, default variants)
     - Cart remove button: cart-item.tsx
     - Address card edit/delete: address-card.tsx
     - Coupon remove: verified-item-list.tsx
     - Filter button: filter-bar.tsx
   - **Mobile nav overlap (H11-H14):** Added `pb-14 lg:pb-0` to _home.tsx, layout.tsx, layout-with-footer.tsx
   - **Broken mobile features (H15-H19):**
     - Made hero banners visible on mobile (removed `hidden lg:block`)
     - Added close button to mobile search overlay
     - Added mobile padding to modal (`p-4 md:p-5`)
     - Added safe-area-inset for iPhone notch to bottom nav
2. Rebuilt shop successfully
3. Restarted shop PM2 process
4. Updated AUDIT.md — marked 19 HIGH issues as fixed
5. Updated PLAN.md — marked Phase 8A, 8B, 8C tasks as completed
6. Updated SESSIONS.md with Session 13

---

## Session 14 (This Conversation)
1. Fixed all remaining 48 MEDIUM + LOW priority mobile issues:
   - **Z-index (M9-M12):** Modal close button, cart header/footer, cart floating button → all z-50
   - **Spacing/Layout (M15-M21):** Payment grid margin, helium padding/price, flash sale height, fluorine image
   - **Responsive/Click (M22, M25, M26, M29):** Search button overflow, argon click conflict, fluorine favorite, cart close icon
   - **Review popup (M11):** bottom-16 → bottom-20 to clear mobile nav
   - **Minor fixes (L15-L18):** Deprecated CSS, modal height, guest label, location dropdown
2. Rebuilt shop successfully
3. Restarted shop PM2 process
4. Updated AUDIT.md — marked all 67 issues as fixed
5. Updated all README files (RESUME.md, SESSIONS.md, PLAN.md, AUDIT.md, .deploy/README.md)
6. Pushed to GitHub (commit `537141a`)

### Phase 8 Complete — All 67 Mobile Audit Issues Fixed
| Priority | Category | Fixed |
|----------|----------|-------|
| HIGH | Touch targets < 44px | 10/10 ✅ |
| HIGH | Fixed elements overlapping | 4/4 ✅ |
| HIGH | Mobile broken features | 5/5 ✅ |
| MEDIUM | Small text | 7/7 ✅ |
| MEDIUM | Z-index conflicts | 5/5 ✅ |
| MEDIUM | Spacing/layout issues | 9/9 ✅ |
| MEDIUM | Missing responsive classes | 3/3 ✅ |
| MEDIUM | Conflicting click handlers | 3/3 ✅ |
| MEDIUM | Touch target borderline | 2/2 ✅ |
| LOW | Dead/commented-out code | 14/14 ✅ |
| LOW | Deprecated/minor | 5/5 ✅ |
| **TOTAL** | | **67/67 ✅** |
