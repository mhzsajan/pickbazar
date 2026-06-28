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
| 5.1 | Clean up header links (11 links is too many — prioritize) | `[x]` | `config/site.ts` lines 109-127 |
| 5.2 | Add breadcrumbs for deep pages (product, shop, category) | `[ ]` | New component + pages |
| 5.3 | Add "back to top" button on long pages | `[ ]` | New component |
| 5.4 | Fix footer — ensure all links work, no dead ends | `[x]` | `footer.tsx` |
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

## Phase 8 — Mobile Visual/UX Fixes (From Audit)

> Goal: Fix all 67 issues found in the mobile visual/UX audit. See `.deploy/AUDIT.md` for full details with file paths and line numbers.

### 8A — Touch Targets (10 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8A.1 | Increase add-to-cart button touch targets to 44px min | `[x]` | H1-H4 |
| 8A.2 | Increase cart remove button touch target to 44px | `[x]` | H5 |
| 8A.3 | Increase address card edit/delete button touch targets | `[x]` | H6 |
| 8A.4 | Increase coupon remove button touch target | `[x]` | H9 |
| 8A.5 | Increase filter bar button touch target to 44px | `[x]` | H10 |
| 8A.6 | Increase bottom nav button touch targets to 44px min | `[ ]` | M28 |
| 8A.7 | Fix cart close button visual vs actual touch target mismatch | `[ ]` | M29 |
| 8A.8 | Increase eye icon button touch target (fluorine card) | `[ ]` | M27 |
| 8A.9 | Increase "Have a coupon?" touch target | `[x]` | H8 |
| 8A.10 | Increase variable product "Cart" button min height | `[ ]` | H7 |

### 8B — Fixed Element Overlaps (4 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8B.1 | Add `pb-14` to home page and layout to clear mobile bottom nav | `[x]` | H11, H12 |
| 8B.2 | Fix cart footer overlapping mobile bottom nav | `[x]` | H13 |
| 8B.3 | Fix cart header z-index mismatch | `[x]` | H14 |
| 8B.4 | Fix review popup overlapping mobile bottom nav | `[ ]` | M11 |

### 8C — Mobile Broken Features (5 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8C.1 | Make hero banner visible on mobile (remove `hidden lg:block`) | `[x]` | H15, H16 |
| 8C.2 | Add close button to mobile search overlay | `[x]` | H17 |
| 8C.3 | Add mobile padding to modal content | `[x]` | H18 |
| 8C.4 | Add safe-area-inset for iPhone notch to bottom nav | `[x]` | H19 |
| 8C.5 | Fix location dropdown hardcoded top offset for mobile | `[ ]` | L18 |

### 8D — Text Size Fixes (7 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8D.1 | Increase cart badge text size from 10px to 12px min | `[ ]` | M1, M2 |
| 8D.2 | Increase product name text size on mobile to 14px min | `[ ]` | M3-M6 |
| 8D.3 | Increase cart item unit/quantity text size | `[ ]` | M7 |

### 8E — Z-Index Fixes (5 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8E.1 | Normalize drawer portal z-index from 999 to consistent value | `[ ]` | M8 |
| 8E.2 | Fix modal z-index stacking conflicts | `[ ]` | M9 |
| 8E.3 | Fix cart header z-index in drawer context | `[ ]` | M10 |
| 8E.4 | Fix cart floating button z-index inconsistency | `[ ]` | M12 |

### 8F — Spacing & Layout Fixes (9 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8F.1 | Fix helium counter tall/narrow shape on mobile | `[ ]` | M13 |
| 8F.2 | Add text truncation to checkout item names | `[ ]` | M14 |
| 8F.3 | Fix "Your Order" heading useless space-x-4 | `[ ]` | M15 |
| 8F.4 | Reduce payment grid mt-10 margin on mobile | `[ ]` | M16 |
| 8F.5 | Adjust helium card header padding for mobile | `[ ]` | M17 |
| 8F.6 | Fix helium strikethrough price overlap | `[ ]` | M18 |
| 8F.7 | Reduce flash sale card image height on mobile | `[ ]` | M19 |
| 8F.8 | Add mobile height constraint to fluorine card image | `[ ]` | M20 |
| 8F.9 | Fix filter bar hardcoded sticky offsets | `[ ]` | M21 |

### 8G — Responsive & Click Handler Fixes (6 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8G.1 | Fix search button overflow on small screens | `[ ]` | M22 |
| 8G.2 | Add xs breakpoint to address grid | `[ ]` | M23 |
| 8G.3 | Add xs breakpoint to schedule grid | `[ ]` | M24 |
| 8G.4 | Fix argon card conflicting click handlers | `[ ]` | M25 |
| 8G.5 | Fix fluorine favorite button overlap on small cards | `[ ]` | M26 |
| 8G.6 | Fix search overlay close button visibility on mobile | `[ ]` | H17 |

### 8H — Dead Code Cleanup (14 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8H.1 | Remove commented-out imports in neon.tsx | `[ ]` | L1 |
| 8H.2 | Remove commented-out imports in fluorine.tsx | `[ ]` | L2 |
| 8H.3 | Remove commented-out className in fluorine.tsx | `[ ]` | L3 |
| 8H.4 | Remove commented-out h3 in cart-item.tsx | `[ ]` | L4 |
| 8H.5 | Remove commented-out PAYMENT_GATEWAYS in payment-grid.tsx | `[ ]` | L5 |
| 8H.6 | Remove commented-out useEffect in payment-grid.tsx | `[ ]` | L6 |
| 8H.7 | Remove commented-out PaymentGroupOption in payment-grid.tsx | `[ ]` | L7 |
| 8H.8 | Remove commented-out verifyCoupon in coupon.tsx | `[ ]` | L8 |
| 8H.9 | Remove commented-out loading in social-login.tsx | `[ ]` | L9 |
| 8H.10 | Remove commented-out defaultPaymentGateway in header.tsx | `[ ]` | L10 |
| 8H.11 | Remove commented-out role="button" in helium.tsx | `[ ]` | L11 |
| 8H.12 | Remove commented-out rc-pagination rules in custom-plugins.css | `[ ]` | L12 |
| 8H.13 | Remove commented-out #siteHeader rule in custom-plugins.css | `[ ]` | L13 |
| 8H.14 | Remove commented-out radio-input rule in custom-plugins.css | `[ ]` | L14 |

### 8I — Minor Fixes (5 tasks)

| # | Task | Status | Audit # |
|---|------|--------|---------|
| 8I.1 | Remove deprecated `-webkit-overflow-scrolling: touch` | `[ ]` | L15 |
| 8I.2 | Fix double viewport height in add-or-update.tsx | `[ ]` | L16 |
| 8I.3 | Add label to guest name input | `[ ]` | L17 |
| 8I.4 | Use xs breakpoint consistently across components | `[ ]` | L19 |
| 8I.5 | Fix search button overflow on 320px screens | `[ ]` | M22 |

---

## Summary

| Phase | Focus | Tasks | Completed | Remaining |
|-------|-------|-------|-----------|-----------|
| 1 — Customization | Branding & Visual | 8 | 0 | 8 |
| 2 — SEO | Google-Friendly | 6 | 0 | 6 |
| 3 — Security | Hacker-Proof | 5 | 0 | 5 |
| 4 — Mobile | Mobile-Friendly | 5 | 0 | 5 |
| 5 — Navigation | UI Navigation | 5 | 2 | 3 |
| 6 — Bugs | Bug Fixes | 5 | 0 | 5 |
| 7 — Performance | Speed | 3 | 0 | 3 |
| 8 — Mobile Audit | Visual/UX Fixes | 67 | 19 | 48 |
| **Total** | | **104** | **21** | **83** |

---

*Created: Session 7 — June 27, 2026*
*Last updated: Session 12 — June 28, 2026 (mobile audit completed, 67 issues found and documented)*
