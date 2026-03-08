

# Plan: Add Event Cards System to Events Page

## Summary
Extend the data model with an `eventsPageCards` array so the admin can add multiple event cards (like the existing Past Bootcamp) to the Events page. The existing bootcamp becomes the default first card. The admin "Events Page" tab gets a new "Event Cards" editor section.

## Changes

### 1. Update data types and defaults (`src/lib/siteData.ts`)
- Add new `EventPageCard` interface: `{ id, title, description, extraText? }`
- Add `eventsPageCards: EventPageCard[]` to `SiteData`
- Default data includes the existing VTSEVA bootcamp as the first card:
  ```
  { title: "Past Bootcamp: VTSEVA Chess Camp 2024", description: "As an active VTSEVA volunteer...", extraText: "The complete bootcamp cost was $15..." }
  ```
- Keep `pastBootcamp` in the type for backward compatibility or remove it (replace with the new array)

### 2. Update Events page rendering (`src/pages/Events.tsx`)
- Replace the single `pastBootcamp` card with a dynamic loop over `siteData.eventsPageCards`
- Each card renders with the same styling: title, description paragraphs, and optional extra text
- Cards stack vertically below the event sections grid

### 3. Update Admin panel (`src/pages/Admin.tsx`)
- In `EventSectionsEditor`, add a new "Event Cards" sub-section with:
  - "Add Event Card" form: Title, Description (textarea), Extra Text (optional)
  - List of existing cards with drag-to-reorder, edit, and delete
  - Same DraggableCard pattern used elsewhere
- Remove or keep the old "Past Bootcamp Section" editor (replace with the new cards editor since the bootcamp is now card #1)

### 4. Context compatibility (`src/contexts/SiteDataContext.tsx`)
- No changes needed -- already spreads partial updates via `updateSiteData`

## What stays the same
- All visual styling, layout, colors, typography on the Events page
- The three event section cards (Summer Camps, Tournaments, Workshops) grid
- Calendar and Registration sections
- All other admin tabs (Events, Programs, Settings)

