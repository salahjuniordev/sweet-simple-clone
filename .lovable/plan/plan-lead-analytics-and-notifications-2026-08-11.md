# Plan - Lead Analytics and Notifications

Implement an admin analytics dashboard for lead submissions, export functionality, and automated email notifications (via server functions simulating the logic or using a mock until real SMTP is configured).

## User Review Required

> [!IMPORTANT]
> Email notifications require a configured email provider (like Resend or SendGrid). I will implement the logic using a `serverFn` that you can later connect to a real API. For now, it will log the intent and handle the database trigger.

- **Analytics Dashboard**: Do you have any specific charts in mind (e.g., Pie chart for service distribution, Bar chart for tiers)? I'll start with these two.
- **Auto-reply Content**: Should the auto-reply follow a specific template or just a generic "Thank you for your inquiry"?

## Technical Details

### 1. Database & Backend
- Add `source` column to `lead_submissions` if missing (it's currently missing in `types.ts`).
- Create a `src/lib/leads.functions.ts` for server-side logic (exporting CSV, sending notifications).

### 2. Admin UI
- Create `src/routes/_admin/admin.analytics.tsx`.
- Integrate `recharts` for visualization.
- Add "Export to CSV" button in the analytics or leads view.

### 3. Notifications logic
- Update `lead-capture-form.tsx` to trigger a server function after submission.
- The server function will handle "sending" (logging) emails to team and user.

### 4. Navigation
- Add "Analytics" to the admin sidebar.
