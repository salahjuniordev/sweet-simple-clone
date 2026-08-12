# Plan - Secure Admin Bootstrap

Create a secure, one-time bootstrap path to allow the creation of the first administrator account if the system is locked or empty.

## User-facing changes
- New secure route at `/auth/bootstrap` for initial setup.
- Automatic redirection to the bootstrap page if no admin accounts exist and an unauthorized user attempts to access the admin area.

## Technical details
- **Server Functions**:
  - `validateBootstrapToken`: Checks a user-provided token against the `ADMIN_BOOTSTRAP_TOKEN` environment variable.
  - `bootstrapAdminUser`: Uses the token to authorize the assignment of the 'admin' role to a newly created user, bypassing standard RLS checks via a server-side admin client.
- **Routing**:
  - `src/routes/auth/bootstrap.tsx`: A multi-step flow (verify token -> create account -> assign role).
  - Updated `src/routes/_admin/route.tsx`: Added a fallback check that redirects to `/auth/bootstrap` if the database has zero admin users.
- **Security**:
  - Requires a secret `ADMIN_BOOTSTRAP_TOKEN` to be set in the environment.
  - Role assignment is performed server-side where the token is verified.
