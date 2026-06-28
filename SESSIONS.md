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
