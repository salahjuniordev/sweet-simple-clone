# Plan: Admin Leads Page Enhancement

Add comprehensive filtering by service and pricing tier to the existing Admin Leads page and implement a detailed view for each lead submission.

## User Review Required

> [!IMPORTANT]
> The leads list already exists at `/admin/leads`, but lacks filtering and detailed views. I will enhance this page to meet the new requirements.

- No new database tables are required.
- I will add `Select` components for filtering.
- I will add a `Dialog` (Modal) for viewing full lead details.

## Technical Details

### Frontend Changes

- **Enhance `src/routes/_admin/admin.leads.tsx`**:
    - Add `useState` for `serviceFilter` and `tierFilter`.
    - Implement a filtering UI using `Select` from Shadcn.
    - Wrap the table row in a clickable area or add a "View" button to open a detailed modal.
    - Use `Dialog` from Shadcn to show full submission details (Name, Email, Message, Service, Tier, Source, Date, Status).
    - Fetch the list of available services from `cms_services` to populate the service filter dropdown.

### Data & Logic

- Update the TanStack Query in `AdminLeads` to optionally accept filters if we wanted server-side filtering, but for current scale, client-side filtering on the fetched `leads` data is more responsive. I'll stick to client-side filtering unless the volume is high.
- Ensure the "Status" update and "Delete" actions still work correctly with the new UI.
