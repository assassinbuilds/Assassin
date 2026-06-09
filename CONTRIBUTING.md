[![Open Source Love](https://firstcontributions.github.io/open-source-badges/badges/open-source-v1/open-source.svg)](https://github.com/firstcontributions/open-source-badges)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

# Contributing to Tech Assassin

Thanks for helping improve Tech Assassin. This guide is beginner-friendly and is inspired by the standard first open-source contribution workflow: fork, clone, edit, commit, push, and open a pull request.

Tech Assassin welcomes contributions that support the mission system, builder proof, student experience, documentation, events, resources, or security posture.

## First Contribution: Add Your Name

If you are new to GitHub or open source, start here. Your first contribution can be a simple contributor profile.

You will create one Markdown file with your name inside the `contributors/` folder.

## Fork This Repository

Fork this repository from GitHub by clicking the **Fork** button.

This creates your own copy of the project under your GitHub account.

## Clone Your Fork

Open a terminal and clone your fork:

```bash
git clone https://github.com/your-username/TechAssassin.git
```

Replace `your-username` with your GitHub username.

Move into the project folder:

```bash
cd TechAssassin
```

## Create a Branch

Create a new branch for your contribution:

```bash
git switch -c add-your-name
```

If `git switch` does not work on your machine, use:

```bash
git checkout -b add-your-name
```

## Add Your Contributor File

Create a file inside the `contributors/` folder:

```text
contributors/your-name.md
```

Use lowercase letters and hyphens for the file name. For example:

```text
contributors/aryan-singh.md
```

Add this content to your file:

```md
# Your Name

- GitHub: @your-username
- Role: Student / Developer / Designer / Builder
- First contribution: Added my contributor profile to Tech Assassin.
- What I want to build: Write one short line about your goal.
```

## Check Your Changes

Run:

```bash
git status
```

You should see your new contributor file listed.

## Commit Your Changes

Stage your file:

```bash
git add contributors/your-name.md
```

Commit it:

```bash
git commit -m "docs(contributors): add your-name"
```

Replace `your-name` with your actual file name.

## Push to GitHub

Push your branch:

```bash
git push -u origin add-your-name
```

## Open a Pull Request

Go to your fork on GitHub. GitHub should show a **Compare & pull request** button.

Open the pull request and mention that this is your first contribution. A maintainer will review it.

## Contributing Code or Docs

For changes beyond your contributor profile:

1. Fork and clone the repository.
2. Create a clear branch name, such as `fix-navbar-links` or `docs-update-readme`.
3. Follow the setup instructions in [README.md](./README.md).
4. Keep your change focused.
5. Run the relevant checks.
6. Open a pull request with a clear summary.

## Commit Format

Use conventional commits:

```text
type(scope): description
```

Common types:

```text
feat, fix, docs, style, refactor, test, chore
```

Common scopes:

```text
client, backend, db, docs, infra, contributors
```

Examples:

```text
docs(contributors): add aryan-singh
feat(client): add user profile page
fix(backend): resolve auth token issue
```

## Code Standards

- Use TypeScript strict mode.
- Use functional React components.
- Use Zod for validation where data enters the app.
- Add tests for new features or risky behavior changes.
- Keep UI changes consistent with the existing design system.
- Never commit secrets, API keys, or real `.env` files.

## Pull Request Checklist

Before opening a pull request, check:

- Your branch is up to date with the target branch.
- Your change is focused and easy to review.
- Tests pass for the area you changed.
- Documentation is updated when behavior changes.
- No secrets or private data are included.

## Testing

Run only the checks relevant to your change.

Frontend:

```bash
cd Client
npm test
```

Backend:

```bash
cd backend
npm test
```

Root project scripts:

```bash
npm test
```

For a contributor-profile-only change, tests are not required.

## Project Structure

```text
TechAssassin/
|-- Client/          # React web app
|-- backend/         # Next.js API and server logic
|-- content/         # Brand, mission, resource, and builder content
|-- contributors/    # First-contribution profile files
|-- database/        # Database schema and related files
|-- Docs/            # Product and project documentation
|-- tools/           # Utility scripts
|-- README.md
|-- CONTRIBUTING.md
|-- SECURITY.md
`-- package.json
```

## Security

- Never commit API keys, tokens, passwords, or private credentials.
- Use environment variables for configuration.
- Keep backend-only secrets out of `VITE_` variables.
- Validate all user input.
- Follow the security rules in [SECURITY.md](./SECURITY.md).

## Need Help?

- Create an issue for bugs or feature ideas.
- Start a discussion for questions.
- Check existing issues before opening a new one.

Thanks for contributing to Tech Assassin.
