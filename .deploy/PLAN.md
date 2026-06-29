# PLAN — Customization, SEO, Mobile, Security & Bugs

> **AI CONTEXT FILE** — Master plan for improving the shop. Read `.deploy/README.md` first. Work through phases in order (1 → 8). After each task, update status and push to GitHub.

---

## Phase 1 — Customization (Branding & Visual)

| # | Task | Status |
|---|------|--------|
| 1.1 | Replace PickBazar logo with your own logo | `[ ]` |
| 1.2 | Replace favicon | `[ ]` |
| 1.3 | Change accent/theme colors to match your brand | `[x]` |
| 1.3b | Dark mode toggle + surface color + removed PageBanner from info pages | `[x]` |
| 1.4 | Update site title and subtitle | `[ ]` |
| 1.5 | Update footer content (contact info, social links, copyright) | `[ ]` |
| 1.6 | Add/replace homepage banner images | `[ ]` |
| 1.7 | Update shop names and descriptions | `[ ]` |
| 1.8 | Replace placeholder product images | `[ ]` |

**Key files:** `shop/public/logo.svg`, `shop/src/config/site.ts`, `shop/src/assets/css/main.css`, `api/rest/src/db/pickbazar/settings.json`

---

## Phase 2 — SEO (Google-Friendly)

| # | Task | Status |
|---|------|--------|
| 2.1 | Fix sitemap.xml + robots.txt — hardcoded `localhost:3000` | `[ ]` |
| 2.2 | Add `NEXT_PUBLIC_SITE_URL` env var for sitemap/robots | `[ ]` |
| 2.3 | Fill SEO settings in API seed data (meta title, description, OG tags) | `[ ]` |
| 2.4 | Add JSON-LD structured data (Organization, Product, BreadcrumbList) | `[ ]` |
| 2.5 | Add per-page SEO for shops, products, categories | `[ ]` |
| 2.6 | Verify canonical URLs are correct | `[ ]` |

**Key files:** `shop/next-sitemap.config.js`, `shop/.env.local`, `api/rest/src/db/pickbazar/settings.json`

---

## Phase 3 — Security (Hacker-Proof)

| # | Task | Status |
|---|------|--------|
| 3.1 | Add security headers via `next.config.js` (CSP, X-Frame-Options, HSTS, etc.) | `[ ]` |
| 3.2 | Lock down CORS in API (restrict to your domains only) | `[ ]` |
| 3.3 | Add rate limiting to API | `[ ]` |
| 3.4 | Add `helmet` middleware to NestJS API | `[ ]` |
| 3.5 | Audit `dangerouslySetInnerHTML` — verify all 12 instances use `sanitize-html` | `[ ]` |

**Key files:** `shop/next.config.js`, `api/rest/src/main.ts`

---

## Phase 4 — Mobile-Friendly

| # | Task | Status |
|---|------|--------|
| 4.1 | Test mobile navigation flow — fix any touch/click issues | `[ ]` |
| 4.2 | Fix mobile search UX (full-width, easy close) | `[x]` |
| 4.3 | Optimize mobile page load (reduce JS bundle, lazy load offscreen) | `[ ]` |
| 4.4 | Test all forms on mobile (login, register, contact, checkout) | `[ ]` |
| 4.5 | Verify PWA manifest is correct (icons, theme color, start_url) | `[ ]` |

**Key files:** `mobile-navigation.tsx`, `mobile-main-menu.tsx`, `header.tsx`

---

## Phase 5 — UI Navigation Fix

| # | Task | Status |
|---|------|--------|
| 5.1 | Clean up header links (11 links is too many — prioritize) | `[x]` |
| 5.2 | Add breadcrumbs for deep pages (product, shop, category) | `[ ]` |
| 5.3 | Add "back to top" button on long pages | `[ ]` |
| 5.4 | Fix footer — ensure all links work, no dead ends | `[x]` |
| 5.7 | Reorganize footer menus: new Policies section (Refunds/Privacy), moved Terms to Customer Service, removed Our Information, cleaned up Explore links | `[x]` |
| 5.5 | Add loading skeletons instead of blank screens | `[ ]` |
| 5.6 | Hide shops navigation (single-shop mode) — removed footer "Shops" link, homepage `/` redirects to `/grocery`. See `SHOPS_RESTORE.md` to restore. | `[x]` |

---

## Phase 6 — Bug Fixes

| # | Task | Status |
|---|------|--------|
| 6.1 | Remove `typescript: { ignoreBuildErrors: true }` — fix underlying errors | `[ ]` |
| 6.2 | Remove `eslint: { ignoreDuringBuilds: true }` — fix lint warnings | `[ ]` |
| 6.3 | Add React error boundary (catches white screen crashes) | `[ ]` |
| 6.4 | Remove unused Google Fonts (Roboto, Raleway, Lato, Rubik, Open Sans) | `[ ]` |
| 6.5 | Audit and fix any broken internal links | `[ ]` |

**Key files:** `next.config.js`, `custom-plugins.css`

---

## Phase 7 — Performance

| # | Task | Status |
|---|------|--------|
| 7.1 | Remove unused font imports (5 fonts loaded, only Google Sans Code used) | `[ ]` |
| 7.2 | Add `loading="lazy"` to below-fold images | `[ ]` |
| 7.3 | Add blur placeholders to `next/image` components | `[ ]` |

---

## Phase 8 — Mobile Visual/UX Fixes (All 67 Issues Fixed ✅)

> All 67 issues from `.deploy/AUDIT.md` are fixed. See AUDIT.md for full details.

**Status:** ✅ Complete (Sessions 13-14)

---

## Phase 9 — Add-to-Cart Flow (REVERTED — Root Causes Documented)

> All changes reverted. Root causes documented in `.deploy/KNOWN_ISSUES.md`.

| # | Task | Status | Priority |
|---|------|--------|----------|
| 9.1 | 2 "+ Cart" buttons in product popup | `[ ]` | HIGH |
| 9.2 | Counter position after adding (appears at bottom) | `[ ]` | HIGH |
| 9.3 | Popup scroll position when switching products | `[ ]` | MEDIUM |
| 9.4-9.8 | Other add-to-cart issues (REVERTED) | `[ ]` | — |

**Key files:** `add-to-cart.tsx`, `add-to-cart-btn.tsx`, `popup.tsx`, `details.tsx`, `short-details.tsx`

---

## Phase 10 — Dark Mode Visual Fixes

| # | Task | Status |
|---|------|--------|
| 10.1 | Fix `text-light` on colored backgrounds → `text-white` (44 files) | `[x]` |
| 10.2 | Fix Alert component dark mode | `[x]` |
| 10.3 | Fix Spinner CSS (use CSS vars instead of static colors) | `[x]` |
| 10.4 | Fix Skeleton loaders dark mode | `[x]` |
| 10.5 | Fix Counter/add-to-cart hex colors (`#666`, `#c1c1c1`) | `[x]` |
| 10.6 | Fix radio button dark mode (`radio.module.css`) | `[x]` |
| 10.7 | Fix notification hex colors (`#686D73`, `#1F2937`, `#6B7280`) | `[x]` |
| 10.8 | Eliminate `text-muted-black` entirely (6 files, invisible in dark mode) | `[x]` |
| 10.9 | Fix page-banner `bg-slate-200` → `bg-gray-100` | `[x]` |
| 10.10 | Add banner image overlays for text readability | `[x]` |
| 10.11 | Fix review-popup text colors | `[x]` |
| 10.12 | Fix modal backdrop + close button dark mode | `[x]` |
| 10.13 | Fix promo popup text visibility | `[x]` |
| 10.14 | Fix search bar border + placeholder contrast in dark mode | `[x]` |
| 10.15 | Add `darkMode: 'class'` to tailwind config | `[x]` |
| 10.16 | Fix theme SSR flash (inline script in `_document.tsx`) | `[x]` |
| 10.17 | Fix theme transition flash (transition-none on load) | `[x]` |
| 10.18 | Convert gray-100 background on modals/backdrop (inverted gray) | `[x]` |
| 10.19 | Fix promo-bottom popup widget dark mode | `[x]` |
| 10.20 | Fix footer category heading/subscribe-section borders | `[x]` |

**Status:** 37 total fixes (20 listed + 17 minor component fixes). All complete ✅ (Sessions 20-22)

---

## Phase 11 — Midjourney-style Animations

| # | Task | Status |
|---|------|--------|
| 11.1 | Create ParticleCanvas component (Canvas 2D, 80-120 particles, constellation lines, mouse interaction) | `[x]` |
| 11.2 | Integrate ParticleCanvas into BannerWithSearch as hero background | `[x]` |
| 11.3 | Create AnimatedSection wrapper (framer-motion `whileInView` fade-up) | `[x]` |
| 11.4 | Apply scroll reveals to Classic layout (promotions, filter bar, product grid) | `[x]` |
| 11.5 | Enhance product card hover effects (glow ring, smoother scale) | `[x]` |
| 11.6 | Add animation keyframes to tailwind config | `[-]` |
| 11.7 | Add CSS variables for particle colors in main.css | `[-]` |
| 11.8 | Performance: pause canvas when not in viewport | `[x]` |

**Status:** 6 done, 2 skipped (not needed). Complete ✅ (Session 24)

**See:** `.deploy/ANIMATIONS.md` for full technical reference

---

## Phase 11b — Ambient Orbs + Shooting Stars (Expanded Canvas)

| # | Task | Status |
|---|------|--------|
| 11.9 | Ambient glow orbs — 8 large drifting radial gradients (layer 1, alpha 0.08-0.20) | `[x]` |
| 11.10 | Shooting stars — random streaks with fading trails, 10 vibrant colors (layer 3) | `[x]` |
| 11.11 | Three-layer canvas architecture (orbs → constellation → streaks) | `[x]` |
| 11.12 | Tune: slower jitter (0.04→0.025), more particles (max 200→300), more streaks (1-3s interval) | `[x]` |
| 11.13 | Per-streak color palette (10 colors: red, orange, gold, lime, green, cyan, blue, violet, magenta, hot pink) | `[x]` |
| 11.14 | Constellation volume reduction (max 180, divisor 12000, alpha 0.25-0.6, line opacity 0.15, width 0.5, dist 180) | `[x]` |
| 11.15 | Streak frequency/visibility boost (0.5-1.5s spawns, 30% burst mode, thicker 3/2 trails, 2.5px head, decay 0.006) | `[x]` |

**Status:** 7/7 done ✅ (Sessions 27-28)

**See:** `.deploy/ANIMATIONS.md` for layer specs and config values
---
## Phase 11c — Universe-themed Layers (Gods, Devils, Witches, Time)

| # | Task | Status |
|---|------|--------|
| 11.16 | Lunar cycle — waxing/waning moon, blood moon, subtleglow in top-right corner | `[x]` |
| 11.17 | Sigil circles — 4 rotating occult symbols (pentagram, hexagram, eye, ouroboros) | `[x]` |
| 11.18 | Clockwork gears — 3 brass-colored rotating mechanisms with teeth and spokes | `[x]` |
| 11.19 | Spirit wisps — 12 floating firefly lights on Lissajous sine-wave paths | `[x]` |
| 11.20 | 7-layer architecture (moon → orbs → sigils → gears → constellation → wisps → streaks) | `[x]` |
| 11.21 | Volume boost: sigils 4→6, gears 3→5, wisps 12→24 | `[x]` |
| 11.22 | Light mode visibility: 2-2.5x alpha boost on all layers, moon alpha 0.2/0.35 | `[x]` |

**Status:** 7/7 done ✅ (Sessions 29-30)

---

## Summary

| Phase | Focus | Tasks | Done | Remaining |
|-------|-------|-------|------|-----------|
| 1 — Customization | Branding | 8 | 1 | 7 |
| 2 — SEO | Google-friendly | 6 | 0 | 6 |
| 3 — Security | Hacker-proof | 5 | 0 | 5 |
| 4 — Mobile | Mobile-friendly | 5 | 1 | 4 |
| 5 — Navigation | UI navigation | 5 | 3 | 2 |
| 6 — Bugs | Bug fixes | 5 | 0 | 5 |
| 7 — Performance | Speed | 3 | 0 | 3 |
| 8 — Mobile Audit | Visual/UX fixes | 67 | 67 | 0 |
| 9 — Add-to-Cart | Flow redesign | 8 | 0 | 8 |
| 10 — Dark Mode UI | Visual fixes | 37 | 37 | 0 |
| 11 — Animations | Midjourney-style | 8 (2 skipped) | 6 | 2 (skipped) |
| 11b — Canvas Expansion | Orbs + streaks | 7 | 7 | 0 |
| 11c — Universe Layers | Moon, sigils, gears, wisps | 7 | 7 | 0 |
| **Total** | | **171** | **128** | **43** |

---

*Created: Session 7 — June 27, 2026*
*Last updated: Session 32 — June 29, 2026*

---

## Restore Point

| Tag | Date | Commit | Description |
|-----|------|--------|-------------|
| `v1.0-20260629-0926` | 2026-06-29 09:26 NPT | `bbbfc91` | Pre-customization — Phase 10 complete, all 23 sessions done |
