# Landmark regions

Use semantic HTML5 landmark regions to help assistive technology and search crawlers understand page structure. Prefer native elements before ARIA roles.

## Global layout

The shared layout should provide:

- Site header: `<header>`
- Primary navigation: `<nav aria-label='Primary'>`
- Page content: `<main id='main-content'>`
- Site footer: `<footer>`

Example:

```tsx
<header>
  <nav aria-label='Primary'>...</nav>
</header>

<main id='main-content'>{children}</main>

<footer>...</footer>
```

## Rules

- Use one `<main>` per page.
- Give each `<nav>` a meaningful `aria-label`, such as `Primary`, `Footer`, or `Breadcrumbs`.
- Keep landmark regions at the top level of the page where possible.
- Do not add redundant ARIA roles when the native element already provides the role.

## Page checklist

Use this list when adding landmarks to pages:

- [ ] Global header, navigation and footer
- [ ] News index
- [ ] News page
- [ ] Projects index
- [ ] Project page
- [ ] Research index
- [ ] Research page
- [ ] Questions index
- [ ] Questions page
- [ ] Map page
- [ ] Support page

## Component library note

When changing a component that lives in `packages/components`, move it to `src/components` in the same pull request, as requested in the landmark regions epic.
