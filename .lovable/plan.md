

# Plan: Coach Photo Upload + Editable Home Hero Section

## 1. Coach Photo Upload (About Page)

**Data model change** (`siteData.ts`):
- Add `coachPhotoUrl?: string` to `AboutPageData`
- When set, About page uses this URL; when empty, falls back to the bundled `tarun-photo.jpeg`

**About page** (`About.tsx`):
- Use `about.coachPhotoUrl || tarunPhoto` as the image `src`

**Admin panel** (`Admin.tsx` — Meet the Coach section):
- Add a file input that reads the selected image via `FileReader.readAsDataURL()` and stores the base64 data URL string in `draft.aboutPage.coachPhotoUrl`
- Show a small preview thumbnail of the current photo
- Add a "Remove Photo" button that clears the field (reverts to default)

## 2. Editable Home Page Hero Section

**Data model change** (`siteData.ts`):
- Add new `HomePage` interface and field to `SiteData`:

```ts
export interface HomePageData {
  heroTagline: string;       // "Welcome to Tarun's Chess Academy"
  heroTitle: string;         // "Build Confidence,"
  heroTitleAccent: string;   // "One Move at a Time"
  heroDescription: string;   // "Patient, fundamentals-first..."
  ctaText: string;           // "Join Now"
  ctaLink: string;           // WhatsApp URL
  secondaryCtaText: string;  // "Explore Programs"
  ctaSectionTitle: string;   // "Ready to Start Your Chess Journey?"
  ctaSectionDescription: string;
  ctaSectionButtonText: string;
}
```

- Add `homePage: HomePageData` to `SiteData` with current hardcoded values as defaults

**Index page** (`Index.tsx`):
- Replace all hardcoded hero strings with `siteData.homePage.*`
- Also replace the bottom CTA section text with dynamic data

**Admin panel** (`Admin.tsx`):
- Add a 6th tab: "Home Page" (update `grid-cols-5` → `grid-cols-6`, add `Home` icon)
- Create `HomePageEditor` component with inputs for:
  - Hero tagline, title, accent text, description
  - CTA button text and link
  - Bottom CTA section title, description, button text

## Files Changed

| File | Change |
|------|--------|
| `src/lib/siteData.ts` | Add `HomePageData` interface, `coachPhotoUrl` field, defaults |
| `src/pages/Index.tsx` | Read hero/CTA text from `siteData.homePage` |
| `src/pages/About.tsx` | Use `coachPhotoUrl` with fallback |
| `src/pages/Admin.tsx` | Add photo upload in coach section, add Home Page tab + editor |

