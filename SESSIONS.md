# SESSIONS — Session History (Compressed)

> **AI CONTEXT FILE** — One-line summary per session. Details in `.deploy/KNOWN_ISSUES.md` for bugs.

| Session | Date | What Was Done |
|---------|------|---------------|
| 1 | Before conversation | Created setup script, nothing installed yet |
| 2 | Jun 27 | Verified prereqs, created .env files, installed deps (npm, not yarn), built all services |
| 3 | Jun 27 | Fixed API start script, started all via PM2, fixed LAN access, rebuilt with LAN IP |
| 4 | Jun 27 | GitHub CLI login, created repo, committed + pushed all code |
| 5 | Jun 27 | Cloudflare tunnel setup, DNS routing, updated .env to public URLs, rebuilt |
| 6 | Jun 27 | Fixed Google OAuth error, API SHOP_URL, PM2 auto-start on boot |
| 7 | Jun 27 | Added Google Sans Code font via Fontsource CDN |
| 8 | Jun 27 | Created master plan (`.deploy/PLAN.md`), updated `.deploy/README.md` |
| 9 | Jun 27 | Fixed homepage footer, header cleanup, removed dead code |
| 10 | Jun 27 | Cleaned header links (removed Offers, Become a Seller) |
| 11 | Jun 27 | Full header visual audit, removed ~50 lines dead code, standardized spacing |
| 12 | Jun 28 | Full mobile audit — found 67 issues, created `.deploy/AUDIT.md` |
| 13 | Jun 28 | Fixed all 19 HIGH priority mobile issues (touch targets, overlaps, broken features) |
| 14 | Jun 28 | Fixed all 48 MEDIUM + LOW priority mobile issues (z-index, spacing, responsive, dead code) |
| 15 | Jun 28 | Fixed modal close button (z-[70]/z-[80]), back button, swipe-to-go-back |
| 16 | Jun 28 | Attempted add-to-cart redesign (quantity popup), NOT pushed |
| 17 | Jun 28 | Reverted add-to-cart changes, documented root causes in KNOWN_ISSUES.md |
| 18 | Jun 28 | Applied dark blue theme (Midjourney-style), fixed 200+ hardcoded colors in 100+ files, fixed text visibility |
| 19 | Jun 28 | Dark mode toggle, surface color, removed PageBanner from 9 pages, fixed search boxes for dark mode |
| 20 | Jun 28 | Dark mode visual audit: fixed search/subscribe borders/placeholders, promo popup text, modal backdrop inverted gray issue, SSR flash, transition flash |
| 21 | Jun 29 | Bulk dark mode UI fixes: text-light→text-white on all colored bg (44 files), Alert dark overrides, spinner CSS vars, skeleton loaders, counter/add-to-cart hex colors, radio.module.css, notification hex colors |
| 22 | Jun 29 | Text visibility audit: exterminated text-muted-black (6 files→text-heading), fixed page-banner bg-slate-200→bg-gray-100, added banner image overlays, fixed review-popup, converted all hardcoded hex text colors (#686D73, #666, #1F2937, #6B7280) to CSS variables |
| 23 | Jun 29 | Tagged restore point `v1.0-20260629-0926`, created backup branch `backup-pre-customization`, updated context files |
| 24 | Jun 29 | Midjourney-style animations: particle canvas constellation (hero), framer-motion scroll reveals (3 sections), card hover glow effects |
| 25 | Jun 29 | Moved canvas to layout-level fixed bg, enabled on all pages via `_home.tsx`, `_general.tsx`, tuned visibility/speed |
| 26 | Jun 29 | Continuous Brownian motion (never settles), added to `layout-with-footer.tsx`, excluded from `layout.tsx` (shop pages), wrap boundaries, created `.deploy/ANIMATIONS.md` |
| 27 | Jun 29 | Ambient glow orbs (8 drifting radial gradients, alpha 0.08-0.20), shooting stars (10 vibrant colors, 0.5-1.5s spawns, 30% burst mode, thicker trails), three-layer canvas architecture |
| 28 | Jun 29 | Optimization pass: constellation reduced (60-180 particles, slower jitter 0.02, fainter lines width 0.5/opacity 0.15/dist 180px), orbs boosted (8, alpha 0.08-0.20, radius 150-400px), streaks maxed (0.5-1.5s, 10 vibrant colors, burst mode) |
| 29 | Jun 29 | Added 4 new universe-themed layers to canvas: lunar cycle (waxing/waning moon + blood moon), sigil circles (pentagram, hexagram, eye, ouroboros), clockwork gears (3 brass mechanisms), spirit wisps (12 sine-wave floating lights). 7-layer architecture complete. |
| 30 | Jun 29 | Volume boost: sigils 4→6, gears 3→5, wisps 12→24. Full light mode visibility: 2-2.5x alpha boost on all theme layers, moon alpha 0.2 (dark) / 0.35 (light), constellation dots/lines boosted. |
| 31 | Jun 29 | Hidden shops navigation for single-shop mode: removed "Shops" link from footer, redirected homepage `/` to `/grocery`. Created `SHOPS_RESTORE.md` for future multi-shop restoration. Minor text branding ("All Shops" → "Switch God!"). |
| 32 | Jun 29 | Footer reorganization: created new "Policies" section (Customer/Vendor Refund, Privacy), reorganized Explore/Customer Service/Our Information, removed duplicate shops link. |
| 33 | Jul 9 | Color scheme consistency audit: fixed `bg-gray-100`/`bg-gray-200` → `bg-surface`/`bg-light` across ~45 files, replaced hardcoded hex borders (`border-[#D4D8DD]` → `border-border-base`) in 3 files, replaced hardcoded bg colors (`bg-[#e6e5eb]`, `bg-[#F1F1F1]`, `bg-[#EEF1F4]`) with CSS var classes, replaced `bg-slate-200`/`text-slate-700` with themed grays, added `<meta name="color-scheme">` to `_document.tsx`, fixed layout containers (`modern.tsx`, `compact.tsx`, `layout.tsx`) for consistent page bg. |

---

## Key Lessons Learned
- **npm, not yarn** — yarn hangs on this machine
- **API must be running** during shop build (Next.js fetches from API at build time)
- **`NEXT_PUBLIC_*` vars** are baked at build time — rebuild required after .env changes
- **Old DNS CNAME records** block new tunnel routing — must delete first
- **PM2 auto-start:** `pm2 startup` + `pm2 save` after changes
- **Modal z-index:** Dialog `z-[70]`, close button `z-[80]` with `fixed` positioning
- **Add-to-cart:** Intersection observer `threshold: 1` triggers sticky bar on mobile (content taller than viewport)
- **Dark theme:** CSS variables in `main.css` control colors. Gray scale is inverted (gray-50=darkest, gray-900=lightest). Use higher gray numbers for text on dark backgrounds.
- **Revert dark theme:** Restore original CSS variables from git history: `git show HEAD~2:shop/src/assets/css/main.css`
- **PageBanner:** Was hardcoded in code, not configurable from admin. Removed from info pages.
- **text-light vs text-white:** `text-light` maps to `--color-light` which becomes near-black in dark mode. On colored backgrounds (accent, red, yellow), use `text-white` (always #ffffff). `text-light` is fine for backgrounds (`bg-light`).
- **text-muted-black is BROKEN in dark mode:** `--color-muted-black` = `rgb(10,12,35)` in dark mode — near-black on dark backgrounds = invisible. Always replace with `text-heading` or `text-body`.
- **Hardcoded Tailwind colors (bg-slate-*, text-[#...]):** These NEVER change with theme. Convert to CSS variable-based classes (`bg-gray-100`, `text-muted`, `text-heading`) for theme responsiveness.
- **Banner text on images:** In dark mode, `text-heading` becomes white. Add `bg-black/20` overlay to ensure text readability on light image areas.
- **SSR flash prevention:** Add inline `<script>` in `_document.tsx` that sets `dark`/`light` class on `<html>` before React hydrates. Set initial theme via `useState(() => localStorage.getItem(...))` in ThemeProvider.
- **Dark mode class must be on `<html>`:** Tailwind's `darkMode: 'class'` checks `<html>` for the `dark` class. ThemeProvider must toggle `document.documentElement`, not `document.body`. CSS selectors must use `:root.dark` not `body.dark`.
- **Particle canvas:** Pure Canvas 2D (no dependencies), detects dark mode via `document.documentElement.classList.contains('dark')`, auto-pauses via IntersectionObserver. Particle count scales with viewport: `min(200, max(60, area/10000))`.
- **Continuous motion:** Brownian motion (random acceleration + speed cap) keeps particles moving forever. Wrap boundaries (re-enter from opposite edge) instead of bounce. See `.deploy/ANIMATIONS.md`.
- **Layout-level background:** Canvas with `fixed` positioning in layout wrappers. Wrappers use `bg-transparent` so canvas shows through. Child components keep their own backgrounds.
- **Excluding canvas from layouts:** Don't import ParticleCanvas — use original `bg-gray-100` or `bg-surface`. Currently excluded from `layout.tsx` (shop pages, checkout, orders, products).
- **Scroll reveals:** `framer-motion` `whileInView` with `once: true` — sections fade in only once on first scroll.
- **Three-layer canvas:** Ambient orbs (layer 1, radial gradients, drift + pulse), constellation particles (layer 2, Brownian motion), shooting stars (layer 3, random colors, fading trails). All share one `requestAnimationFrame` loop. See `.deploy/ANIMATIONS.md`.
- **Per-streak colors:** Shooting stars pick from 10-vibrant-color palette (red, orange, gold, lime, green, cyan, blue, violet, magenta, hot pink) — `color` field per Streak object.
- **Constellation tuning principle:** Particles should be sparse (60-180, divisor 12000), slow (jitter 0.02), and faint (alpha 0.25-0.6, line opacity 0.15) to serve as subtle ambient starfield, not a dense distracting web.
- **7-layer canvas:** Draw order: moon → orbs → sigils → gears → constellation → wisps → streaks. All share one RAF loop, one context.
- **bg-gray-100 vs bg-surface vs bg-light in dark mode:** All three are identical in light mode (`rgb(243,244,246)` for `bg-gray-100`/`bg-surface`, `white` for `bg-light`), but DIFFERENT in dark mode: `bg-light` = `rgb(6,5,29)`, `bg-gray-100` = `rgb(12,14,38)`, `bg-surface` = `rgb(16,18,45)`. Components mixing these create visible shade mismatches in dark mode. Fix: use `bg-light` for page backgrounds, `bg-surface` for cards/containers/surfaces, never `bg-gray-100`/`bg-gray-200` for backgrounds.
- **bg-gray-200 in form inputs:** Fix: `bg-surface` gives consistent dark backgrounds in dark mode.
- **Hardcoded hex borders break dark mode:** `border-[#D4D8DD]` (Stripe forms), `border-[#D1D5DB]` (notifications) stay light gray in dark mode. Always use `border-border-base` or `border-border-200` for theme-adaptive borders.
- **Missing `<meta name="color-scheme">`:** Without this, browser chrome (scrollbars, form elements) uses light mode even when site is in dark mode. Add to `_document.tsx` `<Head>`.
- **Tailwind built-in colors bypass theme:** `bg-slate-200`, `text-slate-700` etc. never adapt. Convert to CSS var-based grays (`bg-gray-300`, `text-heading`).
