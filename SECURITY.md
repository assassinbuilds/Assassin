# Security Policy

Tech Assassin is a public student-builder platform, so secrets and user data must be handled carefully.

## Report a Vulnerability

If you find a vulnerability, do not open a public issue with exploit details. Contact the core team privately through the project owner or community admin channel.

Include:

- A short description of the issue
- Steps to reproduce
- Impact and affected route or file
- Suggested fix, if known

## Secret Rules

- Never commit real `.env`, `.env.local`, or production secret files.
- Frontend code may only use public `VITE_` variables.
- Backend secrets must stay in backend runtime environments.
- Rotate any key that is accidentally exposed.

## Public Frontend Variables

```env
VITE_API_URL=
VITE_APP_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
```

## Backend-Only Secrets

```env
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
JWT_SECRET=
RESEND_API_KEY=
SMTP_PASS=
```

## Baseline Controls

- CORS allowlist only
- Zod validation on forms and APIs
- Server-side admin checks
- Supabase RLS policies
- Rate limiting on write endpoints
- No production debug logs
- GitHub secret scanning and dependency alerts enabled
