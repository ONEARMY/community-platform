---
id: start-contributing
title: Start Contributing
---

## What is my role?

By default we consider everyone that submits a pull request (PR) to be a contributor. People that contribute regularly and want to get more involved can become maintainers to help new contributors. People here for the long term are core maintainers and work on the core of the platform. Here is an overview of the roles

| Role                   | Payment       | Requirements                                      | Tasks                                                                                                       |
| ---------------------- | ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **🤙 Contributor**     |  | A PR is merged                                       | Resolves issues by submitting pull requests                                                                 |
| **⚡️ Maintainer**     | Hourly scale | Minimum 3 merged PR's + chat with core maintainer | Review PR's, help contributors & improve documentation                                                |
| **🔧 Core Maintainer** | Hourly scale  | Minimum 3 months maintainer                       | Review complex PR's, improve code quality, devops, optimisations, security, general updates & documentation |

### 🤙 Things that Contributors do:

#### Pick up issues

1. Pick an open [issue](https://github.com/ONEARMY/community-platform/issues).
3. Read our [contribution guidelines](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md).
3. Add [tests](/Testing/end-to-end).

### ⚡️ Things that Maintainers do:

#### Review incoming code from Contributors

1. Validate code quality and give feedback as needed.
2. Help resolve problems.
3. Ask to add tests as needed.
4. Add new contributors to our [contributors list](#recognising-contributors).

### 🔧 Things that Core Maintainers do:

#### Release changes

- The PR is merged into the `master` branch.
- `master` branch triggers an automated CircleCI build.
- Production deployment requires approval by a maintainer on CircleCI.
- After approval, an automated build deploys to production sites.

# Rewards:

### Recognising Contributors

We have adopted [all contributors](https://allcontributors.org/) and their tooling for managing the contributors listing on the [project README.md](https://github.com/ONEARMY/community-platform/blob/master/README.md).

After merging a new contributors PR:

1. Add a comment to the merged PR mentioning the bot, contributor and their contribution [type](https://allcontributors.org/docs/en/emoji-key), for example: `@all-contributors add @username for code`.
2. A PR will be automatically raised, [example](https://github.com/ONEARMY/community-platform/pull/1952).
3. The PR raised by the `All Contributors` bot will need to be merged with admin privileges as the required CI skips are deliberately skipped.

### Payment

There is a hourly pay for Maintainers. Aimed at developers who help more consistently. If you're interested to become a maintainer feel free to reach out on [Discord](https://discord.gg/gJ7Yyk4).
