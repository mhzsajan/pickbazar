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
| ESLint/TS errors ignored in build | TODO | See PLAN.md Phase 6 |
| Sitemap has localhost URLs | TODO | See PLAN.md Phase 2 |
| No security headers | TODO | See PLAN.md Phase 3 |

---

## Dark Theme — How to Revert

### What Changed (Session 18)
The shop uses a dark blue theme (Midjourney-style #06051d). To revert to original light theme:

### Step 1: Restore CSS Variables
```bash
cd /home/switchgod/Desktop/pickbazar
git show HEAD~2:shop/src/assets/css/main.css > shop/src/assets/css/main.css
```

### Step 2: Revert Component Colors
```bash
# Revert all bg-gray-100 back to bg-white
cd shop
find src -name "*.tsx" -exec sed -i 's/bg-gray-100/bg-white/g' {} +

# Revert all border-border-100 back to border-gray-200
find src -name "*.tsx" -exec sed -i 's/border-border-100/border-gray-200/g' {} +

# Revert all border-border-200 back to border-gray-300
find src -name "*.tsx" -exec sed -i 's/border-border-200/border-gray-300/g' {} +
```

### Step 3: Revert Text Colors
```bash
# Revert text-gray-700 back to text-gray-400
find src -name "*.tsx" -exec sed -i 's/text-gray-700/text-gray-400/g' {} +

# Revert text-gray-800 back to text-gray-600
find src -name "*.tsx" -exec sed -i 's/text-gray-800/text-gray-600/g' {} +

# Revert placeholder-gray-400 back to placeholder-gray-500
find src -name "*.tsx" -exec sed -i 's/placeholder-gray-400/placeholder-gray-500/g' {} +
```

### Step 4: Rebuild
```bash
cd /home/switchgod/Desktop/pickbazar/shop && rm -rf .next && npm run build:rest && pm2 restart shop
```

### Files Changed in Dark Theme
- `shop/src/assets/css/main.css` — CSS variables (backgrounds, text, borders, grays)
- 100+ component files — `bg-white` → `bg-gray-100`, `border-gray-*` → `border-border-*`, `text-gray-*` → lighter versions

### Gray Scale Inversion (Important!)
The dark theme inverts the gray scale:
- `gray-50` = darkest (was lightest)
- `gray-900` = lightest (was darkest)
- For **text** on dark backgrounds, use higher numbers (gray-700, gray-800)
- For **backgrounds**, use lower numbers (gray-50, gray-100)

### Original Light Theme Colors
```css
--color-light: 255, 255, 255;    /* white */
--color-dark: 0, 0, 0;           /* black */
--text-base: 107, 114, 128;      /* gray-500 */
--text-muted: 156, 163, 175;     /* gray-400 */
--text-heading: 31, 41, 55;      /* gray-800 */
--color-border-base: 209, 213, 219; /* gray-300 */
```

---

*Created: Session 17 — June 28, 2026*
*Last updated: Session 18 — June 28, 2026*
