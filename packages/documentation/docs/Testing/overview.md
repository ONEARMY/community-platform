---
id: overview
title: Testing Overview
---

When the platform was first developed we only had a few small modules and use cases, and were able to reasonably manage testing via user testing and strict(ish) typescript typings. Those lightweight days didn't last forever however, and it was decided that an initial testing strategy would first focus on end-to-end tests for common user journeys through core modules (e.g. reading and creating howtos, updating user profiles etc.)

Since then we've mostly focused on building out end-to-end tests in cypress, and are yet to implement specific unit or integration testing strategies (although jest is currently supported and some spec files already exist). You can find documentation in the following pages to help get up and running with the existing test suite.

If you would be interested in helping us to develop an improved long-term testing strategy feel free to [Open A Discussion](https://github.com/ONEARMY/community-platform/discussions) on Github
