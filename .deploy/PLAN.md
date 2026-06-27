# PLAN — Customization, SEO, Mobile, Security & Bugs

> **AI CONTEXT FILE** — This is the master plan for improving the shop. Read `.deploy/README.md` first for full project context. Work through phases in order (1 → 7). Do NOT skip ahead. After each task, update this file's status table and push to GitHub.

---

## How to Use This File

1. Read `.deploy/README.md` for project context
2. Pick the first incomplete task from the earliest active phase
3. Complete the task, test on localhost (`http://localhost:3003`)
4. Update the task status below (mark `[x]` when done)
5. Do NOT push to GitHub until user approves changes on localhost
6. After approval: `rm -rf .next && npx next build && pm2 restart shop` then push

---

## Phase 1 — Customization (Branding & Visual)

> Goal: Make the site look like YOUR brand. Logos, colors, content, and visual identity come first — before SEO or anything else.

| # | Task | Status | Files |
|---|------|--------|-------|
| 1.1 | Replace PickBazar logo with your own logo | `[ ]` | `shop/public/logo.svg`, `shop/src/config/site.ts` |
| 1.2 | Replace favicon | `[ ]` | `shop/public/favicon.ico` |
| 1.3 | Change accent/theme colors to match your brand | `[ ]` | `shop/src/assets/css/main.css` (CSS variables), `tailwind.config.js` |
| 1.4 | Update site title and subtitle | `[ ]` | `api/rest/src/db/pickbazar/settings.json`, `shop/src/config/site.ts` |
| 1.5 | Update footer content (contact info, social links, copyright) | `[ ]` | `shop/src/config/site.ts` (footer section), `shop/src/components/layouts/footer.tsx` |
| 1.6 | Add/replace homepage banner images | `[ ]` | `shop/public/banners/` or API seed data |
| 1.7 | Update shop names and descriptions | `[ ]` | API seed data or admin dashboard |
| 1.8 | Replace placeholder product images | `[ ]` | API seed data or admin dashboard |

### Notes
- Logo is at `shop/public/logo.svg` — linked in `site.ts` line 8
- Theme colors are CSS custom properties in `main.css` lines 6-316 (accent, gray, orange palettes)
- Footer config is in `site.ts` lines 128-218 (menus, commented payment icons)
- Banner images depend on which homepage layout is active (standard, modern, classic, compact, minimal)
- Product images are served from S3 (`pickbazarlaravel.s3.ap-southeast-1.amazonaws.com`) — can be replaced via admin dashboard

---

## Phase 2 — SEO (Google-Friendly)

> Goal: Make the site discoverable by search engines. Fix sitemap, robots.txt, meta tags, and add structured data.

| # | Task | Status | Files |
|---|------|--------|-------|
| 2.1 | Fix sitemap.xml + robots.txt — hardcoded `localhost:3000` | `[ ]` | `shop/next-sitemap.config.js`, `shop/.env.local` |
| 2.2 | Add `NEXT_PUBLIC_SITE_URL` env var for sitemap/robots | `[ ]` | `shop/.env.local` |
| 2.3 | Fill SEO settings in API seed data (meta title, description, OG tags) | `[ ]` | `api/rest/src/db/pickbazar/settings.json` |
| 2.4 | Add JSON-LD structured data (Organization, Product, BreadcrumbList) | `[ ]` | `shop/src/components/seo/` (new file) |
| 2.5 | Add per-page SEO for shops, products, categories | `[ ]` | Individual page files |
| 2.6 | Verify canonical URLs are correct | `[ ]` | `default-seo.tsx` |

### Notes
- SEO seed data is at `api/rest/src/db/pickbazar/settings.json` lines 36-46 — all fields are null
- `default-seo.tsx` cascades to `siteTitle`/`siteSubtitle` when SEO fields are null
- `next-sitemap.config.js` already exists but uses `localhost:3000` fallback
- Need to set `NEXT_PUBLIC_SITE_URL=https://switchgod.com.np` in shop/.env.local

---

## Phase 3 — Security (Hacker-Proof)

> Goal: Add security headers, lock down CORS, prevent common attacks.

| # | Task | Status | Files |
|---|------|--------|-------|
| 3.1 | Add security headers via `next.config.js` (CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | `[ ]` | `shop/next.config.js` |
| 3.2 | Lock down CORS in API (restrict to your domains only) | `[ ]` | `api/rest/src/main.ts` |
| 3.3 | Add rate limiting to API | `[ ]` | `api/rest/src/` |
| 3.4 | Add `helmet` middleware to NestJS API | `[ ]` | `api/rest/src/main.ts` |
| 3.5 | Audit `dangerouslySetInnerHTML` — verify all 12 instances use `sanitize-html` | `[ ]` | Various |

### Notes
- Currently NO security headers configured anywhere
- CORS is wide open: `cors: true` in `api/rest/src/main.ts` line 7
- `dangerouslySetInnerHTML` found in 12 locations — all sanitized via `sanitize-html` but needs verification
- No `middleware.ts` file exists in the shop

---

## Phase 4 — Mobile-Friendly

> Goal: Ensure the site works perfectly on phones and tablets.

| # | Task | Status | Files |
|---|------|--------|-------|
| 4.1 | Test mobile navigation flow — fix any touch/click issues | `[ ]` | `mobile-navigation.tsx`, `mobile-main-menu.tsx` |
| 4.2 | Fix mobile search UX (full-width, easy close) | `[ ]` | `header.tsx` lines 211-229 |
| 4.3 | Optimize mobile page load (reduce JS bundle, lazy load offscreen) | `[ ]` | Various |
| 4.4 | Test all forms on mobile (login, register, contact, checkout) | `[ ]` | Auth components |
| 4.5 | Verify PWA manifest is correct (icons, theme color, start_url) | `[ ]` | `public/manifest.json` |

### Notes
- Mobile nav bar is at `mobile-navigation.tsx` — fixed bottom bar with 4 icons
- PWA manifest exists but icons may be placeholder (192x192, 512x512)
- `apple-mobile-web-app-capable: yes` is set in default-seo.tsx

---

## Phase 5 — UI Navigation Fix

> Goal: Make the site easy to navigate. Clean up clutter, add breadcrumbs, improve UX.

| # | Task | Status | Files |
|---|------|--------|-------|
| 5.1 | Clean up header links (11 links is too many — prioritize) | `[ ]` | `config/site.ts` lines 109-127 |
| 5.2 | Add breadcrumbs for deep pages (product, shop, category) | `[ ]` | New component + pages |
| 5.3 | Add "back to top" button on long pages | `[ ]` | New component |
| 5.4 | Fix footer — ensure all links work, no dead ends | `[ ]` | `footer.tsx` |
| 5.5 | Add loading skeletons instead of blank screens | `[ ]` | Existing loaders |

### Notes
- Current header links: `/shops`, `/offers`, `/contact`, `/become-seller`, `/flash-sales`, `/manufacturers`, `/authors`, `/help`, `/terms`, `/customer-refund-policies`, `/vendor-refund-policies`
- StaticMenu renders first 3 links directly, rest in "Pages" dropdown
- Footer has logo, contact info, menu columns, payment icons, copyright

---

## Phase 6 — Bug Fixes

> Goal: Fix known bugs and code quality issues.

| # | Task | Status | Files |
|---|------|--------|-------|
| 6.1 | Remove `typescript: { ignoreBuildErrors: true }` — fix underlying errors | `[ ]` | `next.config.js` |
| 6.2 | Remove `eslint: { ignoreDuringBuilds: true }` — fix lint warnings | `[ ]` | `next.config.js` |
| 6.3 | Add React error boundary (catches white screen crashes) | `[ ]` | `shop/src/pages/_app.tsx` |
| 6.4 | Remove unused Google Fonts (Roboto, Raleway, Lato, Rubik, Open Sans loaded but not used) | `[ ]` | `custom-plugins.css` |
| 6.5 | Audit and fix any broken internal links | `[ ]` | Various |

### Notes
- `next.config.js` lines 41-48: Both TS and ESLint errors ignored in production builds
- `custom-plugins.css` loads 5 Google Fonts that aren't used (only Google Sans Code is active)
- No React error boundary exists — white screen crashes show blank page

---

## Phase 7 — Performance

> Goal: Make the site faster.

| # | Task | Status | Files |
|---|------|--------|-------|
| 7.1 | Remove unused font imports (5 fonts loaded, only Google Sans Code used) | `[ ]` | `custom-plugins.css` |
| 7.2 | Add `loading="lazy"` to below-fold images | `[ ]` | Product cards |
| 7.3 | Add blur placeholders to `next/image` components | `[ ]` | Image component |

### Notes
- `next/image` is used consistently (good)
- Raw `<img>` tags only in 2 places (footer commented code, file upload preview)
- Dynamic imports already used for 21+ components (good)

---

## Summary

| Phase | Focus | Tasks | Completed | Remaining |
|-------|-------|-------|-----------|-----------|
| 1 — Customization | Branding & Visual | 8 | 0 | 8 |
| 2 — SEO | Google-Friendly | 6 | 0 | 6 |
| 3 — Security | Hacker-Proof | 5 | 0 | 5 |
| 4 — Mobile | Mobile-Friendly | 5 | 0 | 5 |
| 5 — Navigation | UI Navigation | 5 | 0 | 5 |
| 6 — Bugs | Bug Fixes | 5 | 0 | 5 |
| 7 — Performance | Speed | 3 | 0 | 3 |
| **Total** | | **37** | **0** | **37** |

---

*Created: Session 7 — June 27, 2026*
*Last updated: Session 8 — June 27, 2026 (reordered: customization first)*
