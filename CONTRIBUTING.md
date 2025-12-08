# Contribution Guidelines

Thanks for being here already! You'll find all the information you need to start contributing to the project. Make sure to read them before submitting your contribution.

If you think something is missing, consider sending us a PR.

## 🍽 Summary

- [Code of conduct](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-code-of-conduct)
- [Getting started](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-getting-started)
- [Project structure](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-project-structure)
- [Branching](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-branching)
- [Style guide](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-style-guide)
- [Testing](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-testing)
- [Joining the team](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-joining-the-team)
- [Contributing with UX/UI Design](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-contributing-with-uxui-design)

## 👐 Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behaviour to [platform@onearmy.earth](mailto:platform@onearmy.earth).

Also check our [Team Principles](./docs/team-principles.md), which guide our work.

## 📟 Getting started

### Prerequisites

- [Node.js v22.18](https://nodejs.org/en/download/)
- [Yarn v5](https://yarnpkg.com/getting-started/install)

### One time setup

1. Fork the repository.

2. Clone the project from the fork you have created previously at first step:

   ```
   git clone https://github.com/<your-github-username>/community-platform.git
   ```

3. Install dependencies
   ```
   yarn install
   ```
4. [Create a local supabase instance](./docs/supabase.md)

5. Run the app
   ```
   yarn start
   ```

## ⚙️ Technology

Our main technologies are [React Router 7](./docs/react-router-7.md) and [Supabase](./docs/supabase.md)
We try to document some important [Technical Decisions](./docs/technical-decisions.md).

## 🏠 Project Structure

- **`src`**
  - **`routes`** : app routes, including api routes.
  - **`pages`** : Main components for each page are located here. Each folder should correspond to a **feature** of the platform.
  - **`services`** : client-side services to interact with our api and server-side services to interact with supabase or other external service like patreon.
  - **`assets`** : contains assets such as icons/images.
  - **`utils`** : contains utility functions.
- **`packages/components/`**: - general stateless components that compose the app.
- **`packages/themes/`**: - theme definitions for presentation inherited by components
- **`packages/cypress/`** : contains the test automation of End-to-end tests.
- **`shared`** : contains mainly type definitions

## 🌳 Branching

We have a single `master` branch which is linked to production.
QA sites will be created from Pull Request branches upon adding the `Review allow-preview ✅` label (Mainteiners only).
To contribute, you should fork our `master` branch and create a branch from your own fork. When your changes are ready, submit a PR from your fork branch, into our `master` branch.
It is recommended to update your `master` fork regularly to avoid conflicts.

## 🤓 Style guide

We use Prettier and ESLint. This might soon evolve as there are new and shiny tools ✨ like `Biome` and `oxlint` which could provide significant performance and DX advantages.

Running `yarn format` from the project root prior to committing will ensure the code you're adding is formatted to align with the standards of this project.

We expect code to follow standard best practices, such as, simple, clear and self-documenting code, with meaningful names, avoid deep nesting and prop-drilling, and avoid unnecessary abstractions.

## ✅ Testing

Writing tests is crucial for maintaining a robust and reliable codebase. Tests provide a safety net that helps catch errors and unintended behaviour changes before they reach production.

Test Writing Guidelines:

- Unit Tests are useful for code that has logic, it could be a frontend component or a server-side function.
- E2E tests are useful for full feature tests, which require database interaction.
- Focus on testing significant aspects and edge cases, not for the sake of coverage.
- Adhere to the testing conventions and styles established in the project.
- If your changes affect existing functionality, update the corresponding tests to reflect the new behaviour.

## Security

We have evolved our security practices with the introduction of React-Router 7, Fly.io and Supabase in 2024/2025.
A few practices we ensure:
- Database connection is done server-side only
- Secrets are managed server-side on fly.io
- We use `helmet` for CSP and other security checks
- Reduce and keep packages up-to-date to reduce potential vulnerabilities

## 🤝 Joining the team

We are always open to have more people involved. If you would like to contribute more often and become a maintainer, we would love to welcome you to the team. [Join us on Discord](https://discord.gg/gJ7Yyk4) and checkout the [development](https://discord.com/channels/586676777334865928/938781727017558018) channel. Feel free to introduce yourself and outline:

1. How much time you feel you can dedicate to the project
2. Any relevant experience working with web technologies

We ask this so that we can better understand how you might fit in with the rest of the team, and maximise your contributions.

Here are more details about what to expect from becoming a [Maintainer](./docs/maintainers.md)

## 🎨 Contributing with UX/UI Design

We always welcome UX/UI design contributions in various shapes and forms. Whether it's designing new features, giving design feedback or optimising the existing flows.

The best way to start would be to look at [open design issues](https://github.com/ONEARMY/community-platform/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22Task%3A%20Design%22) here in our GitHub Repository to see if anything sparks your interest. Another way is to get in touch with us [through Discord](https://discord.gg/p4hWHYeG), the introduce-yourself channel is a good place for that. :) Then we can chat about what would be interesting for you to help out with, as well as what we are currently working on.

In the meantime you can check out our [UI Component library in Storybook](https://docs.platform.onearmy.earth/storybook-static/index.html?path=/story/components-icon--default).
