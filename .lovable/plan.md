

# Plan: Dynamic About Page Content via Admin Panel

## Summary
Add `aboutPage` data to the existing `SiteData` object, make the About page render from that data instead of hardcoded text, and add an "About Page" tab in the Admin panel for editing all sections.

## Changes

### 1. Extend data model (`src/lib/siteData.ts`)

Add new interfaces and extend `SiteData`:

```ts
export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  iconType: 'book' | 'target' | 'star' | 'user';
}

export interface AboutPageData {
  storyTitle: string;
  storyParagraphs: string[];
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  coachSectionTitle: string;
  coachName: string;
  coachParagraphs: string[];
  features: AboutFeature[];
}
```

Add `aboutPage: AboutPageData` to `SiteData` with current hardcoded text as defaults.

### 2. Update About page (`src/pages/About.tsx`)

- Import `useSiteData` and read `siteData.aboutPage`
- Replace all hardcoded strings with data from the context:
  - Story title and paragraphs mapped dynamically
  - Mission/Vision titles and text
  - Coach name and description paragraphs
  - Why Choose Us cards mapped from `features` array
- Keep all existing layout, animations, styling, and icons exactly as-is

### 3. Add About Page editor tab in Admin (`src/pages/Admin.tsx`)

- Add new `AboutPageEditor` component following the same draft-based pattern as other editors
- Sections inside the editor:
  - **Our Story**: title input + multi-line textarea (paragraphs separated by blank lines)
  - **Mission & Vision**: title + text inputs for each
  - **Meet the Coach**: section title, coach name, description textarea
  - **Why Choose Us Features**: list with add/edit/delete/drag-reorder using existing `DraggableCard` and `useDragReorder` patterns
- Add a 5th tab "About Page" to the `TabsList` (change `grid-cols-4` to `grid-cols-5`)

### 4. No changes to
- Visual layout, colors, typography, spacing, card design on About page
- Existing admin tabs or data flow
- SiteDataContext (already handles partial updates)

