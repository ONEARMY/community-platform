---
id: overview
title: Overview
---

When the platform was first developed we only had a few small modules and use cases, and were able to reasonably manage testing via user testing and strict(ish) typescript typings. Those lightweight days didn't last forever however, and it was decided that an initial testing strategy would first focus on end-to-end tests for common user journeys through core modules (e.g. reading and creating howtos, updating user profiles etc.)

Since then we’ve mostly focused on building out end-to-end tests in cypress, and are gradually introducing unit tests to existing code and it’s a requirement for new code introduced to the system. Although there are some exceptions here around our models as their existing structure is harder to test in isolation.

Jest is our test framework and [some test files already exist](https://github.com/ONEARMY/community-platform/search?q=filename%3A**%2F*.test.ts&type=code).

Unit and integration tests within this project are still in the early stages and we welcome contributions which improve our long-term testing strategy. Please feel free to [Open A Discussion](https://github.com/ONEARMY/community-platform/discussions) on Github

If you have any issues with introducing new tests please feel free to reach out to the maintainers. If you mention `@ONEARMY/maintainers` on your GitHub issue or PR we will get back to as soon as possible.