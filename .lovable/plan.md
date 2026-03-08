

# Performance Optimization Plan

## Analysis

The site is a relatively small React SPA with:
- 2 static images (hero banner JPG, coach photo JPEG) 
- Framer Motion used on every page
- Admin page (1066 lines) loaded eagerly with all routes
- All pages imported synchronously in App.tsx
- localStorage read once on mount via SiteDataContext (already good)
- Google Fonts loaded via CSS @import (render-blocking)
- No code splitting

## Optimizations

### 1. Code Splitting — Route-level lazy loading (`src/App.tsx`)

Replace all page imports with `React.lazy()` + `Suspense`:
- `lazy(() => import('./pages/Index'))`
- `lazy(() => import('./pages/About'))`
- `lazy(() => import('./pages/Programs'))`
- `lazy(() => import('./pages/Events'))`
- `lazy(() => import('./pages/Contact'))`
- `lazy(() => import('./pages/Admin'))` — biggest win, keeps 1000+ line admin bundle off public pages
- `lazy(() => import('./pages/NotFound'))`

Wrap `<Routes>` in `<Suspense fallback={null}>` (or a minimal spinner).

### 2. Font Optimization (`index.html` + `src/index.css`)

- Remove the `@import url(...)` from CSS (render-blocking)
- Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` to `index.html`
- Add `<link rel="preload" as="style" ...>` for the Google Fonts URL with `&display=swap`
- Trim font weights: currently loading Playfair Display 400-700 and Source Sans 3 300-700. Reduce to only used weights (400,600,700 for Playfair; 400,500,600 for Source Sans 3).

### 3. Image Lazy Loading (`src/pages/About.tsx`)

The coach photo is below the fold. Add `loading="lazy"` to the `<img>` tag for `tarunPhoto`. The hero image on Index should NOT be lazy-loaded (it's above the fold) — leave as-is.

### 4. Hero Image Optimization (`src/pages/Index.tsx`)

Add `fetchpriority="high"` and explicit `decoding="async"` to the hero banner `<img>` to hint the browser to prioritize it.

### 5. Reduce FloatingChessPieces Animation Cost (`src/components/FloatingChessPieces.tsx`)

Add `will-change: "transform, opacity"` to each animated piece to promote them to GPU layers, reducing paint cost during continuous animations.

### 6. Remove unused `src/App.css`

This file contains unused Vite starter CSS (`.logo`, `.card`, `.read-the-docs`). It's not imported anywhere meaningful but if imported, removing it eliminates dead CSS.

### 7. HTML Meta Updates (`index.html`)

Add proper `<title>` and description for the chess academy (better perceived performance via meaningful first paint).

## Files Changed

| File | Change |
|------|--------|
| `src/App.tsx` | Lazy imports + Suspense wrapper |
| `index.html` | Font preconnect/preload links, remove render-blocking font import reference, update title |
| `src/index.css` | Remove `@import url(...)`, keep `@tailwind` directives and custom styles |
| `src/pages/About.tsx` | Add `loading="lazy"` to coach photo |
| `src/pages/Index.tsx` | Add `fetchpriority="high"` to hero image |
| `src/components/FloatingChessPieces.tsx` | Add `will-change` style hint |
| `src/App.css` | Delete (unused) |

No UI, layout, logic, or admin functionality changes.

