# PWA Setup Documentation

## Overview

This project has Progressive Web App (PWA) capabilities configured for React Router 7 with **SSR mode**.

**Important:** React Router 7 SSR doesn't generate `index.html` (server renders HTML dynamically), so the PWA uses a `NetworkFirst` caching strategy for navigation instead of precaching static HTML.

## Configuration

1. **vite.config.ts** - PWA plugin configuration
2. **src/root.tsx** - Manifest links added
3. **src/entry.client.tsx** - Service worker registration

## React Router 7 SSR Considerations

With SSR mode (`ssr: true` in react-router.config.ts), there is **no static `index.html` file** generated. The PWA configuration uses:

- `navigateFallback: null` - Disables static navigation fallback
- `NetworkFirst` strategy for navigation requests - Server handles HTML rendering, cached for offline fallback
- Asset precaching still works for JS/CSS/images

This is different from SPA mode where a static `index.html` would be precached.

## Icons and webmanifest

We need to serve icons and webmanifest dynamically as we are a multi-tenant app.

`/manifest.webmanifest` route generates the manifest from `tenant_settings`
`tenant_settings` now has a `pwa_icons` column with the 5 icon sizes required.

## Development

PWA features are **disabled in development** mode because React Router 7's dev server conflicts with the service worker registration.
To test it locally, run `bun run build` and then `bun cross-env NODE_ENV=production bun ./server.js`.
Don't forget to build it again on every change.
