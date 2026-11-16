# Fonts

Self-hosted, bundled by Vite. Ship `woff2` (plus `woff` where available) only. Varela Round uses the Google Fonts subsets with `unicode-range`.

`@font-face` rules are declared in two places, keep them in sync:

- [src/styles/fonts.css](../../styles/fonts.css) — app and the `src/components/ui` Storybook
- [packages/themes/src/fonts/index.ts](../../../packages/themes/src/fonts/index.ts) — legacy `GlobalFonts`, used by the `packages/components` Storybook

The heading font is set by `--brand-font-heading` in [src/styles/ui-globals.css](../../styles/ui-globals.css).
