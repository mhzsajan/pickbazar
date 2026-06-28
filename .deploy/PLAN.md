# PLAN — Customization, SEO, Mobile, Security & Bugs

> **AI CONTEXT FILE** — Master plan for improving the shop. Read `.deploy/README.md` first. Work through phases in order (1 → 8). After each task, update status and push to GitHub.

---

## Phase 1 — Customization (Branding & Visual)

| # | Task | Status |
|---|------|--------|
| 1.1 | Replace PickBazar logo with your own logo | `[ ]` |
| 1.2 | Replace favicon | `[ ]` |
| 1.3 | Change accent/theme colors to match your brand | `[x]` |
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
| 4.2 | Fix mobile search UX (full-width, easy close) | `[ ]` |
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
| 5.5 | Add loading skeletons instead of blank screens | `[ ]` |

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

## Summary

| Phase | Focus | Tasks | Done | Remaining |
|-------|-------|-------|------|-----------|
| 1 — Customization | Branding | 8 | 0 | 8 |
| 2 — SEO | Google-friendly | 6 | 0 | 6 |
| 3 — Security | Hacker-proof | 5 | 0 | 5 |
| 4 — Mobile | Mobile-friendly | 5 | 0 | 5 |
| 5 — Navigation | UI navigation | 5 | 2 | 3 |
| 6 — Bugs | Bug fixes | 5 | 0 | 5 |
| 7 — Performance | Speed | 3 | 0 | 3 |
| 8 — Mobile Audit | Visual/UX fixes | 67 | 67 | 0 |
| 9 — Add-to-Cart | Flow redesign | 8 | 0 | 8 |
| **Total** | | **112** | **69** | **43** |

---

*Created: Session 7 — June 27, 2026*
*Last updated: Session 17 — June 28, 2026*
