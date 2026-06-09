# Website Structure

The current UI should stay intact. New pages should reuse the existing white, slate, red, rounded-card, and bold-heading patterns.

## Primary Pages

- `/` - Home
- `/missions` - Mission 01 and roadmap
- `/join` - Application flow
- `/builders` - Wall of Builders
- `/resources` - Guides, templates, and checklists
- `/community` - Squads, roles, rules, and culture
- `/events` - Events and challenges
- `/about` - Brand story and team

## Navigation

Primary navbar:

- Home
- Missions
- Builders
- Resources
- About
- Join

Community and Events are available in the footer to keep the navbar from becoming crowded.

## Content Rule

Changing website content should live in `Client/src/data/` where possible:

- `brand.ts`
- `missions.ts`
- `builders.ts`
- `resources.ts`
- `events.ts`
- `faqs.ts`
- `nav.ts`

Long-form community content should live in `content/`.
