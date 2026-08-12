# Plan: Content Management System for Mario Studio

Build a full-featured CMS using Lovable Cloud (Supabase) to manage services, blog posts, and case studies.

## User Experience

- **Admin Dashboard**: A secure area (`/admin`) to manage all site content.
- **Authentication**: Secure login flow using Email/Password and Google.
- **Content Editing**: Intuitive forms to create, update, and delete services, blog posts, and case studies.
- **Role-Based Access**: Admins and Editors can manage content; others have read-only or no access.

## Technical Details

- **Database**: 
  - `cms_services`, `cms_posts`, `cms_case_studies` tables with full schema matching current static data.
  - `user_roles` table for role-based security using Postgres RLS.
- **Authentication**: 
  - Integration with Lovable Cloud Auth (Supabase Auth).
  - Auth middleware to protect admin routes.
- **Frontend**:
  - TanStack Start routes for `/admin` sections.
  - Shadcn UI components for data tables and forms.
  - Transition from static `src/lib/*.ts` data to dynamic database queries.
- **Security**: 
  - Row Level Security (RLS) policies to protect content.
  - Server-side validation of user roles.

## Steps

1. **Database Schema**: Apply migrations to create content and role tables.
2. **Auth Setup**: Configure managed Google and Email auth.
3. **Admin Layout**: Create `src/routes/_admin/route.tsx` with auth guards.
4. **Admin UI**: Build list and form views for Services, Blog, and Work.
5. **Data Integration**: Refactor existing routes to fetch data from the database instead of static files.
6. **Seed Data**: Migrate existing static content into the database.
