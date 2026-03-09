

# Update SEO & Social Media Metadata

## What Changes

### 1. `index.html` — Replace all default/Lovable metadata
- Remove the `<!-- TODO -->` comment
- Update `og:title`, `og:description`, `og:url` to Tarun Chess Academy branding
- Update `twitter:title`, `twitter:description`, remove `@Lovable` site reference
- Add `meta name="keywords"` for SEO
- Add `og:url` pointing to `https://tarun-chess.lovable.app`
- Keep existing favicon, fonts, and description (already correct)
- OG/Twitter images will keep the current preview screenshot URL (since no new preview image was uploaded)

### 2. `src/pages/Admin.tsx` — Set document title
- Add `useEffect` to set `document.title = "Admin Panel | Tarun Chess Academy"` on mount and restore on unmount

### 3. `src/pages/Index.tsx` — SEO heading structure
- The hero `h1` already renders the academy name dynamically from `siteData`. No changes needed unless the data values are wrong — heading structure is already sound.

## What Does NOT Change
- All existing functionality, routes, UI, admin CRUD, auth flow — untouched
- Favicon already updated previously — no change needed (Issue 6 is already resolved)
- Page `<title>` already says "Tarun Chess Academy" — no change needed
- `meta description` and `meta author` already correct

## Final `index.html` head will look like:
```html
<title>Tarun Chess Academy — Chess Classes, Camps & Tournaments</title>
<link rel="icon" href="/favicon.ico" type="image/x-icon" />
<link rel="apple-touch-icon" href="/favicon.ico" />
<meta name="description" content="Tarun Chess Academy offers professional chess training for kids and adults. Improve strategy, tactics, and tournament skills with expert coaching." />
<meta name="keywords" content="Tarun Chess Academy, chess coaching, chess training, online chess classes, chess academy India, chess lessons for kids" />
<meta name="author" content="Tarun Chess Academy" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Tarun Chess Academy – Learn Chess from Experts" />
<meta property="og:description" content="Join Tarun Chess Academy to master chess strategies, tactics, and competitive gameplay. Training for beginners and advanced players." />
<meta property="og:url" content="https://tarun-chess.lovable.app" />
<meta property="og:image" content="[existing preview URL]" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Tarun Chess Academy – Learn Chess Professionally" />
<meta name="twitter:description" content="Join Tarun Chess Academy and improve your chess skills with structured training programs." />
<meta name="twitter:image" content="[existing preview URL]" />
```

