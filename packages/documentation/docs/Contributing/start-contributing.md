---
id: start-contributing
title: Start Contributing
---

## What is my role?

By default we consider everyone that submits a PR a contributor. People that contribute regularly and want to get more involved can become maintainers to help new contributors. People here for the long term are core maintainers and work on the core of the platform. Here is an overview of the roles

| Role                   | Payment       | Requirements                                      | Tasks                                                                                                      |
| ---------------------- | ------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **🤙 Contributor**     | Bounty System | Submit a PR                                       | Resolves issues by submitting Pull Requests                                                                |
| **⚡️ Maintainer**     | Bounty System | Minimum 3 merged PR's + chat with core maintainer | Review basic PR's, help contributors, improve documentation                                                |
| **🪛 Core Maintainer** | Hourly scale  | Minimum 3 months maintainer                       | Review complex PR's, Improve code quality, Devops, optimisations, Security, general updates, Documentation |

## 🤙 Contributors to do:

1. Check our [documentation](/) to run it locally.
2. Pick an open [issue](https://github.com/ONEARMY/community-platform/issues).
3. There is a reward on it if it has a [bounty](/Contributing/bounties) label.
4. Read our [contribution guidelines](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md)
5. Bonus: Add [tests](/Testing/end-to-end).

## ⚡️ Maintainers to do:

#### Review incoming Pull Requests

1. Validate if code is clean
2. Validate if the [project structure](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--project-structure) is correct
3. Check out user profile to see who is behind the commit
4. Add them to our [contributors list](#recognising-contributors)
5. Make sure [Lint commit](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--commit-style-guide) message is correct
6. Make sure all checks are passed and help to resolve errors.
7. Bonus: Ask for integrating tests

## 🪛 Core Maintainer to do:

#### Merging PRs & Releasing Changes

1. Merge the PR
2. A deployment will be triggered to the development environments.
3. Verify changes in the development environment
4. An automated Release PR will be generated
5. Approve and merge the Release PR
6. A deployment will be triggered to production environments.

# In more detail:

### Recognising Contributors

We have adopted [all contributors](https://allcontributors.org/) and their tooling for managing the contributors listing on the [project README.me](https://github.com/ONEARMY/community-platform/blob/master/README.md).

After merging a new contributors PR:

1. Add a comment to the merged PR mentioning the bot, contributor and their contribution [type](https://allcontributors.org/docs/en/emoji-key), for example: `@all-contributors add @githubUsername for code`
2. A PR will be automatically raised, [example](https://github.com/ONEARMY/community-platform/pull/1952)
3. The PR raised by the All Contributors bot will need to be merged with admin privileges as the required CI skips are deliberately skipped.

### Payment

Each role get paid a bit differently. Contributors and maintainers get paid according to the [Bounty system](/Contributing/bounties). For core maintainers there is a separate hourly pay scale. Aimed at developers who help a bit more consistently at around 2-3h per week. If you're interested in these roles then feel free to reach out on [Discord](https://discord.com/invite/SSBrzeR) or during the monthly dev call.

### Off-boarding

When a maintainer has decided to step away the following items should be reviewed to ensure that all permissions are revoked.

- [ ] Remove user from [Firebase projects](https://console.firebase.google.com/)
  - Precious Plastic PROD
  - Precious Plastic DEV
  - Project Kamp PROD
  - Project Kamp DEV
  - Fixing Fashion PROD
  - Fixing Fashion DEV

* [ ] Remove [GitHub maintainer permissions](https://github.com/ONEARMY/community-platform/settings/access)
* [ ] Raise PR to remove maintainer status
* [ ] Remove from Google Analytics sites
* [ ] Remove admin permission within the Community Platform
  - - Precious Plastic PROD
  - - Precious Plastic DEV
  - - Project Kamp PROD
  - - Project Kamp DEV
  - - Fixing Fashion PROD
  - - Fixing Fashion DEV
