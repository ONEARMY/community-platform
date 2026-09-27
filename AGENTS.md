# AGENTS.md

Rules for AI coding agents working in this repository. Humans: see [CONTRIBUTING.md](./CONTRIBUTING.md).

Follow these exactly. PRs that ignore them are closed without review.

## Before you start

- Work on **one** issue, and only an issue that is **assigned to you**. Do not open unsolicited PRs.
- Do not touch files unrelated to that issue. No drive-by refactors, no reformatting, no dependency bumps.

## Setup

Requires [Bun 1.4.2](https://bun.sh/docs/installation) and a [local Supabase instance](./docs/supabase.md).

```
bun install
bun start          # app on http://localhost:3000
```

## Before opening a PR

```
bun run format     # biome, required
bun run test:unit  # required
```

E2E (Cypress) runs in CI. Do not run it locally unless asked.

## UI changes: screenshots are mandatory

If you changed anything under `src/pages/`, `src/components/`, `packages/components/`, `packages/themes/`, or any `.css` file, you **must**:

1. Run the app and look at your change in a browser. Do not skip this.
2. Attach to the PR description:
   - a **before** and **after** screenshot,
   - the same view at **mobile width** (375px),
   - for `src/components/ui/`, a screenshot from Storybook (`bun run storybook:ui`, port 6008).

A PR that changes UI with no screenshot will be closed. "It should work" is not acceptable.

New components in `src/components/ui/` also need a matching `*.stories.tsx`.

## Writing the PR

- Use the template. Do not delete its sections or rewrite it in your own format.
- Keep the description short, **under 400 words**. Say what changed and why (why only if not already in context). Nothing else.
- No summaries of your own reasoning, no changelog of your process, no restating the diff, no emoji headings you invented.
- Link the issue: `Closes #123`.

## Code style

See the [style guide](./CONTRIBUTING.md#-style-guide). In short:

- Biome formats and lints. Match surrounding code.
- **Do not add code comments.** The codebase is deliberately comment-free.
- Simple, self-documenting code. Avoid deep nesting, prop-drilling, and unnecessary abstractions.
- Extend existing functions rather than adding near-duplicates.

## Which UI library

New work uses `src/components/ui/` (shadcn / Base UI, Tailwind v4). `packages/components` (theme-ui) is legacy and migrated opportunistically. Read [src/components/ui/README.md](./src/components/ui/README.md) before adding or migrating a component.

## Layout

- `src/routes` — app and API routes
- `src/pages` — one folder per platform feature
- `src/services` — client- and server-side service layer
- `src/components/ui` — current component library
- `packages/components` — legacy component library
- `packages/cypress` — e2e tests
- `shared` — shared types

## Security

Database access is server-side only. Secrets live server-side on fly.io. Never add a client-side DB call or commit a secret.
