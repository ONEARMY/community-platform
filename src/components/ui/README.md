# Platform UI (shadcn / Base UI)

A new component library built with [shadcn](https://ui.shadcn.com/) and [Base UI](https://base-ui.com/) primitives, styled with Tailwind CSS v4. It lives alongside the existing [`oa-components`](../../../packages/components) (theme-ui) library rather than replacing it outright.

## Why a second library

`oa-components`'s `Icon` system and general styling setup predate current tooling (theme-ui, Emotion runtime CSS-in-JS, a hand-maintained icon glyph map). Rather than a big-bang rewrite of 100+ components and their 140+ call sites across the app, this library is adopted via a **strangler-fig migration**: new components and pages use this library going forward, existing `oa-components` usage is left as-is and migrated opportunistically over time. There is no fixed deadline to finish migrating or to delete `oa-components`.

## Location

Components live in `src/components/ui/` — app-local, not a separate Bun workspace package. `oa-components` is only really consumed by this one app (its own Storybook is just a dev harness), so a new workspace package would only add build/export-condition overhead (`tsc --build`, dual `bun`/`import` package.json exports) that this app's Vite setup doesn't actually need — Vite already consumes `.tsx` source directly.

## Base UI, not Radix

This project uses shadcn's `--base base` option, which generates components on top of [Base UI](https://base-ui.com/) instead of Radix. Set up via:

```
bunx shadcn@latest init -y -d -b base -t vite
```

Add new components the normal way:

```
bunx shadcn@latest add <component>
```

## Theming: tenant colors via CSS variables

Tenant brand colors (`primary`, `accent`, each with a `-hover` variant) come from the `tenant_settings` table in Supabase, and are already wired up independently of this library:

`tenant_settings` (DB) → `TenantSettingsService.get()` → `root.tsx` `loader()` → an SSR-rendered `<style>:root { --color-primary: ...; --color-accent: ...; }</style>` tag in `<head>`.

This library's theme (`src/styles/ui-globals.css`) maps shadcn's expected tokens onto those same variables:

```css
--primary: var(--color-primary);
--accent: var(--color-accent);
```

So this library and the legacy `oa-themes`/theme-ui setup both read from the exact same DB-driven CSS variables — no duplicate theming logic, no backend changes needed. Only `primary` and `accent` are actually DB-driven; there is no separate `secondary` tenant color, so `secondary`/`muted`/`destructive` keep shadcn's static defaults.

For exact hover-color parity with the legacy `Button` (which swaps to `--color-primary-hover` outright rather than an opacity-based hover), the default button variant uses an arbitrary Tailwind value: `hover:bg-[var(--color-primary-hover)]`.

## Icons: custom SVGs, not an icon library

Of the ~110 icons in the legacy `oa-components` `Icon` system, ~90 are already custom brand art (not generic icons) — the platform's icons are a deliberate part of its visual identity, not a place to introduce a generic icon library like lucide-react.

Convention for this library:

- Custom icons live as raw `.svg` files under `src/components/ui/icons/`, imported directly as components via `vite-plugin-svgr`'s `?react` suffix:

  ```tsx
  import Close from './icons/close.svg?react';

  <Close className="size-4 text-muted-foreground" />;
  ```

  No central glyph-map/switch component — each icon is its own tree-shakeable import, which is what makes this approach tree-shakeable (the legacy `Icon` component's shared glyph object meant every consumer bundled references to essentially all ~90 icons regardless of which one they used).

- Source SVGs should use `fill="currentColor"` (or `stroke="currentColor"`) and no inline `width`/`height`/pixel `style` — size and color are controlled by the consumer via `className`, exactly like Base UI/shadcn's own icon usage.
- Only 6 icons have been ported so far (`close`, the 4 `chevron-*` directions, `search`) as a proof of the pattern — porting the rest of the ~90 custom icons is a follow-up, done opportunistically as components that need them get migrated.
- 19 of the legacy glyphs are generic (`react-icons`, e.g. `menu`, `lock`, `check`, `filter`) rather than custom brand art. These are a small, drawable set — the plan is to eventually commission custom versions of these too and drop the `react-icons` dependency entirely, rather than pull in a generic icon library (e.g. lucide-react) for them. Not a blocker for anything else in this library.
- Separately, 23 confirmed-unused legacy icon assets (~281KB, mostly old map-pin iconography) were deleted from `packages/components/assets/icons/` as basic repo hygiene. A further pass to optimize the oversized remaining assets (several are 10-30KB Figma exports that should be sub-2KB) was considered and intentionally deferred — out of scope for this change.

## Rendering raw/CMS HTML

For content that comes pre-rendered as HTML (e.g. `dangerouslySetInnerHTML`) rather than authored as JSX, wrap it in `prose max-w-none dark:prose-invert` (via [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography)) instead of hand-styling each tag. Tailwind's Preflight strips default browser spacing/font-sizing from `h1`–`h6`, `p`, `ul`, etc., so unstyled HTML needs this to look reasonable. `max-w-none` drops the plugin's default `65ch` cap. See `src/routes/_.membership-terms.tsx` for an example.

## Storybook

This library has its **own** Storybook instance, independent of `oa-components`'s (`packages/components/.storybook`, port 6006):

```
bun run storybook:ui
```

Runs on port 6008, config at `.storybook` (repo root). It intentionally does not reuse the app's root `vite.config.ts` (React Router's SSR plugin, VitePWA, and Leaflet chunking are irrelevant to isolated component rendering, and the React Router plugin actually can't run outside the real app — see `.storybook/main.ts`'s `viteConfigPath` for why an explicit empty `vite.config.ts` is pointed to instead of letting `@storybook/builder-vite` auto-discover the nearest one). It has its own lean plugin set (Tailwind, SVGR, tsconfig-paths) via `viteFinal`, and mirrors the same tenant theme-switcher toolbar as the legacy Storybook so both libraries can be checked under the same tenant brand colors.

## What's intentionally out of scope here

- Migrating any of the 100+ existing `oa-components` components or their call sites.
- Porting the remaining ~85 custom icons.
- Dropping `react-icons` (blocked on custom art for the 19 generic glyphs).
- Deleting `oa-components`/`oa-themes` — only after the migration is complete.
