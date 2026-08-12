---
name: Service Page Enhancements
description: Implementation plan for case studies, lead capture, SEO, and interactive pricing on service pages.
type: feature
---

## Database Changes
1.  **Lead Submissions Table**: Create `public.lead_submissions` to store service inquiries.
    - Columns: `id`, `created_at`, `name`, `email`, `service_slug`, `tier`, `message`, `status`.
    - RLS: Authenticated can read/delete, Anon can insert.

2.  **Case Study Filtering**: Ensure `cms_case_studies` has `service_slugs` (array) for filtering. (Existing: `service_slugs: string[]`).

## UI Components
1.  **LeadCaptureForm**: A new component for service detail pages.
    - Props: `defaultServiceSlug`, `defaultTier`.
    - Functionality: Pre-fills fields, submits to Supabase, shows success state.

2.  **PricingSelector**: Interactive tier selector for service pages.
    - State: `selectedTier` (Basic | Starter | Premium).
    - Updates: Reflects price, features, and pre-fills the lead form.

3.  **CaseStudyGrid**: Filtered display of case studies relevant to the service.

## SEO & Metadata
1.  **Structured Data**: Enhance `head()` in `services.$slug.tsx` with `FAQPage` and detailed `Service` schema.
2.  **OpenGraph**: Dynamic OG images (placeholder or generated via service metadata).

## Admin Dashboard
1.  **Service Editor**: Enhance `admin.services.tsx` to manage:
    - Icons (Lucide selection).
    - Plans/Pricing (JSON editor or field grid).
    - Benefits/Deliverables (Array management).
2.  **Leads Manager**: New route `/admin/leads` to view and manage inquiries.