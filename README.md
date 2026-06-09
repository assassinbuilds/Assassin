# Tech Assassin

**From Beginner to Builder, One Mission at a Time.**

Tech Assassin is a mission-based student builder platform that helps students move from learning to building through structured missions, squads, real projects, and public proof-of-work.

[Live website](https://tech-assassin.vercel.app/)

## What Is Tech Assassin?

Students do not need one more random group. They need direction, accountability, teammates, and proof.

Tech Assassin gives students:

- Mission-based learning
- GitHub and portfolio building
- Hackathon preparation
- Student squads
- Proof submission
- Wall of Builders
- Events and showcases
- Beginner-friendly resources

## Why Assassin?

At Tech Assassin, Assassin means precision, focus, discipline, and execution. It is not about violence.

A Tech Assassin removes confusion, beats procrastination, builds with discipline, and ships real work.

## Product Journey

Visitor -> Apply -> Join Mission -> Complete Tasks -> Submit Proof -> Get Featured -> Level Up

## Core Product Modules

- Public website: Home, Missions, Join, Wall of Builders, Community, Resources, Events, About
- Mission system: Mission 01, daily tasks, proof checklist, batch roadmap
- Builder showcase: Featured builders, shipped projects, testimonials, profile proof
- Resources: GitHub guide, README template, LinkedIn examples, portfolio structure, hackathon checklist
- Backend API: Auth, events, profiles, missions, resources, community services

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Clerk
- Backend: Next.js API routes, TypeScript, Supabase/Postgres
- Data and auth: Supabase, Clerk
- Deployment: Vercel for web, Render-compatible backend config

## Repository Structure

```text
techassassin/
|-- Client/              # Public website and future student dashboard
|-- backend/             # API, server logic, auth, Supabase integrations
|-- content/             # Brand, mission, resource, and builder content
|-- Docs/                # Product, brand, security, roadmap, website docs
|-- tools/               # Existing utility scripts
|-- README.md
|-- SECURITY.md
|-- package.json
|-- render.yaml
`-- vercel.json
```

The repo intentionally keeps the current `Client` and `backend` folders for stability. A later migration can move them to `apps/web` and `apps/api` once the product surface is stable.

## Local Setup

```bash
npm install
npm install --prefix Client
npm install --prefix backend
npm run dev:client
```

Run the backend separately when API work is needed:

```bash
npm run dev:backend
```

## Environment Variables

Frontend variables must be public Vite values only:

```env
VITE_API_URL=
VITE_APP_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
```

Backend-only secrets must never be exposed through `VITE_` variables:

```env
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
JWT_SECRET=
RESEND_API_KEY=
SMTP_PASS=
```

## Security Rules

- Do not commit real `.env` files.
- Keep service keys and database URLs backend-only.
- Use CORS allowlists for deployed origins.
- Validate forms and API payloads with Zod.
- Enforce server-side roles for admin actions.
- Keep Supabase RLS policies enabled for user-owned data.
- Disable production debug logs.
- Keep GitHub secret scanning and dependency alerts enabled.

See [SECURITY.md](./SECURITY.md) and [Docs/SECURITY.md](./Docs/SECURITY.md).

## Roadmap

- Phase 1: Website pages, mission funnel, README, docs, content structure
- Phase 2: Student dashboard, mission checklist, proof submission
- Phase 3: Wall of Builders automation and project showcase
- Phase 4: Admin application review and mission progress tools
- Phase 5: Events, sponsors, certificates, and partner reporting

## Contributing

Contributions should support the mission system, builder proof, student experience, or security posture. Start with [CONTRIBUTING.md](./CONTRIBUTING.md).

## Tagline

Learn. Build. Ship. Repeat.

## License

MIT. See [LICENSE](./LICENSE).
