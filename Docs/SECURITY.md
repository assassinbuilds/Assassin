# Security Checklist

This repo is public and uses frontend and backend deployment surfaces. Treat configuration and user data carefully.

## Frontend

Allowed public variables:

```env
VITE_API_URL=
VITE_APP_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
```

Never put service keys, database URLs, SMTP passwords, or private Clerk keys in frontend code.

## Backend

Backend-only values:

```env
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
JWT_SECRET=
RESEND_API_KEY=
SMTP_PASS=
```

## Application Controls

- Validate all form and API payloads with Zod.
- Enforce server-side role checks for admin actions.
- Keep Supabase RLS policies active for user-owned data.
- Use rate limits on write and auth-adjacent endpoints.
- Use CORS allowlists for production domains.
- Remove debug endpoints or gate them before production.
- Avoid real user emails, phone numbers, and secrets in docs or tests.

## Incident Response

If a secret is exposed:

1. Revoke or rotate it immediately.
2. Remove it from the repository history if needed.
3. Audit deployment logs and affected services.
4. Document the fix and prevention step.
