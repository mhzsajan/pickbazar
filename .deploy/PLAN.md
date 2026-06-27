# PLAN — UI Fix, SEO, Mobile, Security & Bugs

> **AI CONTEXT FILE** — This is the master plan for improving the shop. Read `.deploy/README.md` first for full project context. Work through phases in order (1 → 6). Do NOT skip ahead. After each task, update this file's status table and push to GitHub.

---

## How to Use This File

1. Read `.deploy/README.md` for project context
2. Pick the first incomplete task from the earliest active phase
3. Complete the task, test on localhost (`http://localhost:3003`)
4. Update the task status below (mark `[x]` when done)
5. Do NOT push to GitHub until user approves changes on localhost
6. After approval: `rm -rf .next && npx next build && pm2 restart shop` then push

---

## Phase 1 — SEO (Google-Friendly)

> Goal: Make the site discoverable by search engines. Fix sitemap, robots.txt, meta tags, and add structured data.

| # | Task | Status | Files |
|---|------|--------|-------|
| 1.1 | Fix sitemap.xml + robots.txt — hardcoded `localhost:3000` | `[ ]` | `shop/next-sitemap.config.js`, `shop/.env.local` |
| 1.2 | Add `NEXT_PUBLIC_SITE_URL` env var for sitemap/robots | `[ ]` | `shop/.env.local` |
| 1.3 | Fill SEO settings in API seed data (meta title, description, OG tags) | `[ ]` | `api/rest/src/db/pickbazar/settings.json` |
| 1.4 | Add JSON-LD structured data (Organization, Product, BreadcrumbList) | `[ ]` | `shop/src/components/seo/` (new file) |
| 1.5 | Add per-page SEO for shops, products, categories | `[ ]` | Individual page files |
| 1.6 | Verify canonical URLs are correct | `[ ]` | `default-seo.tsx` |

### Notes
- SEO seed data is at `api/rest/src/db/pickbazar/settings.json` lines 36-46 — all fields are null
- `default-seo.tsx` cascades to `siteTitle`/`siteSubtitle` when SEO fields are null
- `next-sitemap.config.js` already exists but uses `localhost:3000` fallback
- Need to set `NEXT_PUBLIC_SITE_URL=https://switchgod.com.np` in shop/.env.local

---

## Phase 2 — Security (Hacker-Proof)

> Goal: Add security headers, lock down CORS, prevent common attacks.

| # | Task | Status | Files |
|---|------|--------|-------|
| 2.1 | Add security headers via `next.config.js` (CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | `[ ]` | `shop/next.config.js` |
| 2.2 | Lock down CORS in API (restrict to your domains only) | `[ ]` | `api/rest/src/main.ts` |
| 2.3 | Add rate limiting to API | `[ ]` | `api/rest/src/` |
| 2.4 | Add `helmet` middleware to NestJS API | `[ ]` | `api/rest/src/main.ts` |
| 2.5 | Audit `dangerouslySetInnerHTML` — verify all 12 instances use `sanitize-html` | `[ ]` | Various |

### Notes
- Currently NO security headers configured anywhere
- CORS is wide open: `cors: true` in `api/rest/src/main.ts` line 7
- `dangerouslySetInnerHTML` found in 12 locations — all sanitized via `sanitize-html` but needs verification
- No `middleware.ts` file exists in the shop

---

## Phase 3 — Mobile-Friendly

> Goal: Ensure the site works perfectly on phones and tablets.

| # | Task | Status | Files |
|---|------|--------|-------|
| 3.1 | Test mobile navigation flow — fix any touch/click issues | `[ ]` | `mobile-navigation.tsx`, `mobile-main-menu.tsx` |
| 3.2 | Fix mobile search UX (full-width, easy close) | `[ ]` | `header.tsx` lines 211-229 |
| 3.3 | Optimize mobile page load (reduce JS bundle, lazy load offscreen) | `[ ]` | Various |
| 3.4 | Test all forms on mobile (login, register, contact, checkout) | `[ ]` | Auth components |
| 3.5 | Verify PWA manifest is correct (icons, theme color, start_url) | `[ ]` | `public/manifest.json` |

### Notes
- Mobile nav bar is at `mobile-navigation.tsx` — fixed bottom bar with 4 icons
- PWA manifest exists but icons may be placeholder (192x192, 512x512)
- `apple-mobile-web-app-capable: yes` is set in default-seo.tsx

---

## Phase 4 — UI Navigation Fix

> Goal: Make the site easy to navigate. Clean up clutter, add breadcrumbs, improve UX.

| # | Task | Status | Files |
|---|------|--------|-------|
| 4.1 | Clean up header links (11 links is too many — prioritize) | `[ ]` | `config/site.ts` lines 109-127 |
| 4.2 | Add breadcrumbs for deep pages (product, shop, category) | `[ ]` | New component + pages |
| 4.3 | Add "back to top" button on long pages | `[ ]` | New component |
| 4.4 | Fix footer — ensure all links work, no dead ends | `[ ]` | `footer.tsx` |
| 4.5 | Add loading skeletons instead of blank screens | `[ ]` | Existing loaders |

### Notes
- Current header links: `/shops`, `/offers`, `/contact`, `/become-seller`, `/flash-sales`, `/manufacturers`, `/authors`, `/help`, `/terms`, `/customer-refund-policies`, `/vendor-refund-policies`
- StaticMenu renders first 3 links directly, rest in "Pages" dropdown
- Footer has logo, contact info, menu columns, payment icons, copyright

---

## Phase 5 — Bug Fixes

> Goal: Fix known bugs and code quality issues.

| # | Task | Status | Files |
|---|------|--------|-------|
| 5.1 | Remove `typescript: { ignoreBuildErrors: true }` — fix underlying errors | `[ ]` | `next.config.js` |
| 5.2 | Remove `eslint: { ignoreDuringBuilds: true }` — fix lint warnings | `[ ]` | `next.config.js` |
| 5.3 | Add React error boundary (catches white screen crashes) | `[ ]` | `shop/src/pages/_app.tsx` |
| 5.4 | Remove unused Google Fonts (Roboto, Raleway, Lato, Rubik, Open Sans loaded but not used) | `[ ]` | `custom-plugins.css` |
| 5.5 | Audit and fix any broken internal links | `[ ]` | Various |

### Notes
- `next.config.js` lines 41-48: Both TS and ESLint errors ignored in production builds
- `custom-plugins.css` loads 5 Google Fonts that aren't used (only Google Sans Code is active)
- No React error boundary exists — white screen crashes show blank page

---

## Phase 6 — Performance

> Goal: Make the site faster.

| # | Task | Status | Files |
|---|------|--------|-------|
| 6.1 | Remove unused font imports (5 fonts loaded, only Google Sans Code used) | `[ ]` | `custom-plugins.css` |
| 6.2 | Add `loading="lazy"` to below-fold images | `[ ]` | Product cards |
| 6.3 | Add blur placeholders to `next/image` components | `[ ]` | Image component |

### Notes
- `next/image` is used consistently (good)
- Raw `<img>` tags only in 2 places (footer commented code, file upload preview)
- Dynamic imports already used for 21+ components (good)

---

## Summary

| Phase | Tasks | Completed | Remaining |
|-------|-------|-----------|-----------|
| 1 — SEO | 6 | 0 | 6 |
| 2 — Security | 5 | 0 | 5 |
| 3 — Mobile | 5 | 0 | 5 |
| 4 — Navigation | 5 | 0 | 5 |
| 5 — Bugs | 5 | 0 | 5 |
| 6 — Performance | 3 | 0 | 3 |
| **Total** | **29** | **0** | **29** |

---

*Created: Session 7 — June 27, 2026*
*Last updated: Session 7 — June 27, 2026*
