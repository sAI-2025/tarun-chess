

# Plan: Contact Page Editor + Register Now Link in Admin

## 1. Data Model (`src/lib/siteData.ts`)

Add two new data structures:

```ts
export interface ContactPageData {
  pageTitle: string;           // "Contact Us"
  pageSubtitle: string;        // "Have a question or..."
  email: string;               // "tarun.tubati9@gmail.com"
  phone: string;               // "+1 (984) 687-6038"
  phoneRaw: string;            // "+19846876038" (for tel: link)
  whatsappMessage: string;     // "Hi! I'm interested..."
  formRecipientEmail: string;  // "tarun.tubati9@gmail.com" (mailto target)
}

export interface EventsPageData {
  registerLink: string;        // "https://forms.gle/bkeWgrhbDyHGckok7"
  registerText: string;        // "Register Now"
  registrationDescription: string; // "Ready to sign up..."
}
```

Add `contactPage: ContactPageData` and `eventsPage: EventsPageData` to `SiteData` with current hardcoded values as defaults.

## 2. Dynamic Rendering

**Contact page (`Contact.tsx`)**:
- Import `useSiteData`, read `siteData.contactPage`
- Replace hardcoded email, phone, WhatsApp message, mailto target, page title/subtitle

**Events page (`Events.tsx`)**:
- Import `useSiteData`, read `siteData.eventsPage`
- Replace hardcoded Google Form link, "Register Now" text, and registration description

## 3. Admin Panel (`Admin.tsx`)

Add a 7th tab **"Contact"** (with `Mail` icon) and update grid to `grid-cols-7`.

**ContactPageEditor** component with inputs for:
- Page title and subtitle
- Email address, phone (display + raw), WhatsApp default message
- Form recipient email

Add "Register Now Link" fields to the existing **Events Page** tab (`EventSectionsEditor`):
- Registration link URL
- Button text
- Registration description text

## Files Changed

| File | Change |
|------|--------|
| `src/lib/siteData.ts` | Add `ContactPageData`, `EventsPageData` interfaces + defaults |
| `src/pages/Contact.tsx` | Read from `siteData.contactPage` |
| `src/pages/Events.tsx` | Read register link from `siteData.eventsPage` |
| `src/pages/Admin.tsx` | Add Contact tab + editor, add register fields to Events Page tab |

