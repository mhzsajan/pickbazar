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
- **Particle canvas:** Pure Canvas 2D (no dependencies), detects dark mode via `document.documentElement.classList.contains('dark')`, auto-pauses via IntersectionObserver. Particle count scales with viewport: `min(120, max(40, area/15000))`.
- **Scroll reveals:** `framer-motion` `whileInView` with `once: true` — sections fade in only once on first scroll.
