---
id: start-contributing
title: Start Contributing
---

## What is my role?

By default we consider everyone that submits a pull request (PR) to be a contributor. People that contribute regularly and want to get more involved can become maintainers to help new contributors. People here for the long term are core maintainers and work on the core of the platform. Here is an overview of the roles

| Role                   | Payment       | Requirements                                      | Tasks                                                                                                       |
| ---------------------- | ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **🤙 Contributor**     | Bounty System | Submit a PR                                       | Resolves issues by submitting pull requests                                                                 |
| **⚡️ Maintainer**     | Bounty System | Minimum 3 merged PR's + chat with core maintainer | Review basic PR's, help contributors & improve documentation                                                |
| **🔧 Core Maintainer** | Hourly scale  | Minimum 3 months maintainer                       | Review complex PR's, improve code quality, devops, optimisations, security, general updates & documentation |

### 🤙 Things that Contributors do:

#### Pick up issues

1. Check our [documentation](/) to run it locally.
2. Pick an open [issue](https://github.com/ONEARMY/community-platform/issues).
3. If there is a [bounty](/Contributing/bounties) label on it you can claim a reward.
4. Read our [contribution guidelines](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md).
5. Bonus: Add [tests](/Testing/end-to-end).

### ⚡️ Things that Maintainers do:

#### Review incoming code from Contributors

1. Validate if code is clean.
2. Validate if the [project structure](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--project-structure) is correct.
3. Check out user profile to see who is behind the commit.
4. Add them to our [contributors list](#recognising-contributors).
5. Make sure [Lint commit](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--commit-style-guide) message is correct.
6. Make sure all checks are passed and help to resolve errors.
7. If there is a [bounty](/Contributing/bounties) label on the PR you can get it for reviewing.
8. Bonus: Ask for integrating tests.

### 🔧 Things that Core Maintainers do:

#### Review complex PRs & release changes

There is a workflow for deploying code changes from development to production environments. It ensures proper review, testing, and versioning before reaching production sites.

The steps are as follows:

- The PR is merged into the `master` branch.
- `master` branch triggers an automated build and deployment to development environments.
- Manual approval is required by a maintainer in CircleCI
- After approval, an automated build, versioning, and deployment to production sites.

# Rewards:

### Recognising Contributors

We have adopted [all contributors](https://allcontributors.org/) and their tooling for managing the contributors listing on the [project README.md](https://github.com/ONEARMY/community-platform/blob/master/README.md).

After merging a new contributors PR:

1. Add a comment to the merged PR mentioning the bot, contributor and their contribution [type](https://allcontributors.org/docs/en/emoji-key), for example: `@all-contributors add @username for code`.
2. A PR will be automatically raised, [example](https://github.com/ONEARMY/community-platform/pull/1952).
3. The PR raised by the `All Contributors` bot will need to be merged with admin privileges as the required CI skips are deliberately skipped.

### Payment

Each role gets paid a bit differently. Contributors and maintainers get paid according to the [Bounty system](/Contributing/bounties). For core maintainers there is a separate hourly pay scale. Aimed at developers who help a bit more consistently at around 2-3 hours per week. If you're interested in these roles then feel free to reach out on [Discord](https://discord.gg/gJ7Yyk4).

## Onboarding checklist

| Tasks                                                                                                                                                      | 🤙 Contributor | ⚡️ Maintainer | 🔧 Core Maintainer |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------- | ------------------ |
| Invite to [Discord](https://discord.gg/gJ7Yyk4) #development                                                                                               | ☑️             | ☑️             | ☑️                 |
| Send link to [bounty](/Contributing/bounties) system                                                                                                       | ☑️             | ☑️             | ☑️                 |
| Add GitHub [maintainer permissions](https://github.com/ONEARMY/community-platform/settings/access)                                                         |                | ☑️             | ☑️                 |
| Add maintainer status using [All contributors ](#recognising-contributors)                                                                                 |                | ☑️             | ☑️                 |
| Get on a video call                                                                                                                                        |                | ☑️             | ☑️                 |
| Explain hourly rate vs bounty system                                                                                                                       |                | ☑️             | ☑️                 |
| Add GitHub [core maintainer permissions](https://github.com/ONEARMY/community-platform/settings/access)                                                    |                |                | ☑️                 |
| Add core-maintainer status using [All contributors ](#recognising-contributors)                                                                            |                |                | ☑️                 |
| Invite to Google Analytics                                                                                                                                 |                |                | ☑️                 |
| Invite to **Firebase** projects: Precious Plastic PROD, Precious Plastic DEV, Project Kamp PROD, Project Kamp DEV, Fixing Fashion PROD, Fixing Fashion DEV |                |                | ☑️                 |
