# KNOWN ISSUES — Bugs, Root Causes, Attempted Fixes

> **AI CONTEXT FILE** — Central place for known bugs, root causes, and what NOT to try again. Read this before fixing any issue.

---

## Add-to-Cart Issues (Session 16-17, REVERTED)

All add-to-cart code was reverted to original. Here are the root causes found:

### Issue 1: Two "+ Cart" Buttons in Product Popup
- **Symptom:** Both sticky bar and details section show "+ Cart" buttons
- **Root cause:** Intersection observer `threshold: 1` in `details.tsx:74-77` triggers sticky bar immediately on mobile (content taller than viewport)
- **Key files:** `details.tsx:74-77`, `short-details.tsx:171`, `popup.tsx:54`
- **What NOT to try:** Changing threshold to 0 changes sticky bar behavior globally

### Issue 2: Counter Appears at Bottom of Popup
- **Symptom:** After adding to cart, counter appears at bottom of popup instead of where button was
- **Root cause:** AddToCart in Details section is positioned at bottom of product info (below image, name, price, description, variations). Counter replaces button in same DOM position
- **Key files:** `details.tsx:238`, `add-to-cart.tsx:122-136`
- **What NOT to try:** Moving AddToCart higher in details causes layout issues

### Issue 3: Popup Not Scrolling to Top
- **Symptom:** When switching products in popup, scroll position stays at bottom
- **Root cause:** Modal Dialog has `overflow-y-auto`, no scroll-to-top on product change
- **Key files:** `popup.tsx`, `modal.tsx`
- **Status:** PARTIALLY FIXED — `popup.tsx` now resets `stickyShortDetailsAtom` and scrolls dialog to top

### Key Architecture Notes
- `stickyShortDetailsAtom` (Jotai) is global state shared between `popup.tsx` and `details.tsx`
- Intersection observer in `details.tsx` controls sticky bar visibility
- `ShortDetails` (sticky bar) has `hidden md:block` — hidden on mobile, shown on desktop
- Both Details and ShortDetails use `variant="big"` which renders full-width button
- After adding to cart, `isInCart` check returns true → Counter replaces button

---

## Other Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| Yarn hangs on "Fetching packages..." | Known | Use npm instead |
| Google OAuth not configured | By design | GoogleProvider commented out in [...nextauth].ts |
| Dark mode broken | Reverted | Tried and fully reverted (commit ed44c2b) |
| ESLint/TS errors ignored in build | TODO | See PLAN.md Phase 6 |
| Sitemap has localhost URLs | TODO | See PLAN.md Phase 2 |
| No security headers | TODO | See PLAN.md Phase 3 |

---

*Created: Session 17 — June 28, 2026*
