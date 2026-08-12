# SEO, Service Inquiries, and Admin Enhancements

The objective is to finalize the service detail pages with robust SEO, lead capture capabilities, and a fully functional admin interface for managing service details.

## Proposed Changes

### SEO & Discoverability
- Enhance `src/routes/services.$slug.tsx` with comprehensive OpenGraph and JSON-LD structured data (Service and FAQ schemas).
- Ensure every service detail page is correctly indexed with unique metadata.

### Lead Capture
- Integrate the existing `LeadCaptureForm` into `src/routes/services.$slug.tsx`.
- Enable pre-filling of the selected service and pricing tier to improve conversion rates.

### Admin CMS Enhancements
- Refactor `src/routes/_admin/admin.services.tsx` to include an edit dialog for services.
- Implement forms for managing:
  - Basic service info (Title, Slug, Tagline, Intro, Icon).
  - Pricing tiers (Basic, Starter, Premium) including price, note, and features.
  - Deliverables and Benefits lists.

## Technical Details
- **Data Handling**: Use `supabase` client for real-time CRUD operations.
- **UI Components**: Utilize `shadcn/ui` (Dialog, Form, Input, Textarea, Table) for a consistent admin experience.
- **State Management**: TanStack Query for caching and invalidating service data after edits.
- **SEO**: TanStack Router's `head()` for dynamic meta tag injection.

## User Review Required

> [!IMPORTANT]
> The admin edit form will allow updating complex JSON structures (pricing tiers). I'll ensure the UI handles these as manageable lists/fields.
