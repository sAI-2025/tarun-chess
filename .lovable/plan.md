

# SEO Optimization Plan — Tarun Chess Academy

## Problem
The `index.html` contains multiple Lovable-branded metadata traces that hurt SEO and social sharing:
- `og:title` = "Lovable App"
- `og:description` = "Lovable Generated Project"
- `twitter:site` = "@Lovable"
- `twitter:title` = "Lovable App"
- `twitter:description` = "Lovable Generated Project"
- `og:image` and `twitter:image` point to Lovable CDN preview screenshots
- A leftover TODO comment about Lovable

## Changes

### 1. Clean up `index.html` metadata
Replace all Lovable-branded meta tags with Tarun Chess Academy branding:

| Tag | Current | New |
|-----|---------|-----|
| `og:title` | "Lovable App" | "Tarun Chess Academy — Chess Classes, Camps & Tournaments" |
| `og:description` | "Lovable Generated Project" | Same as existing meta description |
| `og:url` | missing | "https://tarun-chess.lovable.app" |
| `og:image` | Lovable CDN screenshot | `/favicon.ico` (or hero banner if hosted publicly) |
| `twitter:site` | "@Lovable" | Remove (no Twitter account) or set to academy handle |
| `twitter:title` | "Lovable App" | Match og:title |
| `twitter:description` | "Lovable Generated Project" | Match og:description |
| `twitter:image` | Lovable CDN screenshot | Match og:image |

Remove the `<!-- TODO: Update og:title -->` comment.

Add additional SEO tags:
- `<meta name="keywords">` with chess-related terms
- `<link rel="canonical">` pointing to published URL
- `<meta name="robots" content="index, follow">`

### 2. Add per-page `document.title` updates
Create a small `useDocumentTitle` hook and add it to each page so the browser tab title changes per route:

- **Home**: "Tarun Chess Academy — Chess Classes, Camps & Tournaments"
- **About**: "About Us | Tarun Chess Academy"
- **Programs**: "Programs | Tarun Chess Academy"
- **Events**: "Events | Tarun Chess Academy"
- **Contact**: "Contact Us | Tarun Chess Academy"
- **Admin**: "Admin | Tarun Chess Academy"

### 3. Add JSON-LD structured data
Add a `<script type="application/ld+json">` block in `index.html` with Organization schema:
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Tarun Chess Academy",
  "description": "Expert chess coaching...",
  "url": "https://tarun-chess.lovable.app"
}
```

### Files modified
- `index.html` — replace all Lovable metadata, add canonical/keywords/robots/JSON-LD
- New: `src/hooks/useDocumentTitle.ts` — small hook
- `src/pages/Index.tsx`, `About.tsx`, `Programs.tsx`, `Events.tsx`, `Contact.tsx`, `Admin.tsx` — add `useDocumentTitle()` call

No layout, functionality, or styling changes.

