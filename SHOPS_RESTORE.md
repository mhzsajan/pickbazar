# Shops Page — Restore Guide

## Context

The shop pages (`/shops`, `/shops/[slug]`) were **hidden from navigation** because the site currently runs a single shop. The routes and page files remain intact — only the links pointing to them were removed.

When you're ready to enable multi-shop support, apply the changes below.

---

## What Was Changed

### 1. Footer — Removed "Shops" Link

**File:** `shop/src/config/site.ts`

**Change:** Removed the "Shops" entry from the footer `menus[0].links` array (under "text-explore").

**To restore:** Add it back:

```ts
{
  name: 'Shops',
  href: Routes.shops,
},
```

Insert as the first item in the `links` array of the `text-explore` menu section (before `{ name: 'Authors', ... }`).

---

### 2. Homepage — Root `/` Now Redirects to `/grocery`

**File:** `shop/src/pages/[[...pages]].tsx`

**Change:** When `layout === 'shops'` (root `/`), the component now client-side redirects to `/grocery` via `useEffect` + `router.replace`.

**To restore:** Remove the redirect `useEffect` block:

```tsx
  // Redirect homepage / to default type page (single-shop mode)
  useEffect(() => {
    if (layout === 'shops') {
      router.replace('/grocery');
    }
  }, [layout]);
```

No other changes needed — the `ShopsHome` component and all imports remain intact.

---

## What Was NOT Changed (Still Intact)

| Item | File | Status |
|------|------|--------|
| `/shops` page (all shops listing) | `shop/src/pages/shops/index.tsx` | **Untouched** |
| `/shops/[slug]` page (individual shop) | `shop/src/pages/shops/[slug]/index.tsx` | **Untouched** |
| ShopCard component | `shop/src/components/ui/cards/shop.tsx` | **Untouched** |
| ShopsHome component in `[[...pages]].tsx` | `shop/src/pages/[[...pages]].tsx` | **Untouched (dead code)** |
| `routes.ts` — `Routes.shops` and `Routes.shop()` | `shop/src/config/routes.ts` | **Untouched** |
| API endpoints for shops | `api/rest/src/shops/` | **Untouched** |
| Admin panel — Shops section | `admin/rest/` | **Untouched** |

All these are ready to use — just re-add the navigation links and the homepage logic, then rebuild.

---

## How to Rebuild After Restoring

```bash
# API must be running
cd /home/switchgod/Desktop/pickbazar/shop && rm -rf .next && npm run build:rest && pm2 restart shop
```
