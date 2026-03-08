

# Plan: Footer Content Editor in Admin Panel

## Data Model (`src/lib/siteData.ts`)

Add a new interface and default data:

```ts
export interface FooterData {
  brandName: string;           // "Tarun's Chess Academy"
  tagline: string;             // "Building confident, thoughtful chess players..."
  contactEmail: string;        // "tarun.tubati9@gmail.com"
  copyrightText: string;       // "Tarun's Chess Academy. All rights reserved."
  quickLinks: { id: string; label: string; path: string }[];
  socialLinks: { id: string; platform: string; url: string }[];
}
```

Add `footer: FooterData` to `SiteData` with current hardcoded values as defaults. Social links start as an empty array (none exist currently).

## Footer Component (`src/components/Footer.tsx`)

Import `useSiteData`, replace all hardcoded text (brand name, tagline, email, quick links, copyright) with `siteData.footer.*`. Render social links dynamically if any exist.

## Admin Panel (`src/pages/Admin.tsx`)

Add an **8th tab "Footer"** (with a layout icon). Update `grid-cols-7` to `grid-cols-8`.

**FooterEditor** component with:
- Brand name and tagline inputs
- Contact email input
- Copyright text input
- Quick links list: editable label + path per link, add/remove/reorder
- Social links list: platform selector (Facebook, Twitter/X, Instagram, YouTube, LinkedIn) + URL input, add/remove

## Files Changed

| File | Change |
|------|--------|
| `src/lib/siteData.ts` | Add `FooterData` interface + defaults in `SiteData` |
| `src/components/Footer.tsx` | Read from `siteData.footer`, render dynamically |
| `src/pages/Admin.tsx` | Add Footer tab + `FooterEditor` component |

