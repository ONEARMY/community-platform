# Contribution Guidelines

Thanks for being here already! You'll find all the information you need to start contributing to the project. Make sure to read them before submitting your contribution.

If you think something is missing, consider sending us a PR.

## 🍽&nbsp; Summary

- [Code of conduct](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--code-of-conduct)
- [Getting started](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--getting-started)
- [Issue Tracking and Management](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--issue-tracking-and-management)
- [Development Bounties](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--dev-bounties)
- [Project structure](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--project-structure)
- [Branch structure](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--branch-structure)
- [Javascript style guide](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--javascript-style-guide)
- [Commit style guide](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--commit-style-guide)
- [Deployment](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--deployment)
- [Joining the team](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--joining-the-team)
- [Resources](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#--resources)
- [Why haven't you used ...](https://github.com/ONEARMY/community-platform/blob/master/CONTRIBUTING.md#-why-havent-you-used-insert-favourite-languageframeworkconvention-here)

## 👐 &nbsp; Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behaviour to [platform@onearmy.earth](mailto:platform@onearmy.earth).

## 📟 &nbsp; Getting started

**Prerequisites**

- [Node.js v18](https://nodejs.org/en/download/)
- [Yarn v3](https://yarnpkg.com/getting-started/install)

With the above tools available, you are ready:

1. Fork the repository.

2. Clone the project from the fork you have created previously at first step :
   `git clone https://github.com/`**your-github-user**`/community-platform.git`

3. Install dependencies
   `yarn`

4. Run the dev server
   `yarn start`

More information is available in the [developer documentation](https://docs.platform.onearmy.earth/).

## 🐛 &nbsp; Issue Tracking and Management

Issues are tracked on GitHub. Use the labels to filter them to your needs and/or skills.
Anybody can create an issue or feature request, but be sure to use our templates if you want your voice to be heard.
Some issues are collated to form modules which are the parent of each section of the platform. Modules are then split into **pages** and finally **components**. You can navigate through them by filtering with the labels `Type:Module` and `Type:Pages`. Having a look at **module** and **pages** issues is the best way to get a clear overview of the ongoing work on it.

Additionally if you have identified a bug, please try to write a test to make reproducible (and less likely to arise in the future). You can find more information to do this in the [Testing Overview](https://onearmy.github.io/community-platform/Testing/overview)

We've also labelled some of the issues with _[Good first issue](https://github.com/ONEARMY/community-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+first+issue%22)_ to help you get started quickly.
When you start working on an issue, comment on it or if your are a registered contributor assign yourself to let us know so we avoid working on something twice. The comment should include a mention to [@ONEARMY/maintainers](https://github.com/orgs/ONEARMY/teams/maintainers).

It is expected that the developer will have done thorough testing themselves first, this helps make sure most pull requests get merged quickly.

## 🤑 &nbsp; Development Bounties

We have a small bounty system as a way of saying thanks to developers for contributing their time and code. Find out more about it in [Bounties](./BOUNTIES.md)

## 🏠 &nbsp; Project Structure

- **`scripts`** & **`config`** : contains build-related scripts and configuration files. Usually, you don't need to touch them.

- **`cypress`** : contains the test automation of End-to-end tests.
- **`functions`** : contains the backend firebase related functions.
- **`src`** : contains the source code. The codebase is written in ES2015.
  - **`assets`** : contains assets such as icons/images.
  - **`models`** : here you will find the general data flow, such as a user's profile, while component states and properties are declared within the component.
  - **`pages`** : makes up the visual routing of the application. Each folder then corresponds to a **section** or **module** of the platform.
  - **`stores`** : In addition to app state, the store folder contains actions and dispatchers, while global state property mapping is dealt with in page components.
  - **`utils`** : contains global utility functions, e.g. firebase database helper.
- **`packages/components/`**: - general stateless components that compose the app.
- **`packages/themes/`**: - theme definitions for presentation inherited by components
- **`types`** : contains TypeScript type definitions

## 🌳 &nbsp; Branch Structure

We have two main branches linked to production and development sites, you should always start with the `master` branch as this contains the most up-to-date code, and will be where pull requests are added for review. The `production` branch contains the live production site, PRs are automatically raised that will merge changes in from `master`. Maintainers are responsible for merging these PRs.

We use additional branches to define a specific feature or issue group being worked on. An example might be work on the home page, which would be done in the `19-home-page` branch (where 19 refers to the issue number describing what needs to be done). These branches are ephemeral, and will be removed after merging into `master`, followed by closing the issue. Generally it is expected that only 1 developer will be working on a given branch, and it is that developer's responsibility to create the branch, manage the pull request, reviews and ask for additional support when needed.

## 🚀 &nbsp; Deployment(s)

The `master` branch is our current development leading branch, and will auto-deploy to the
development environment. The `production` branch deploys to the production environment.

|                  | Development                                                            | Production                                                             |
| ---------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Precious Plastic | [dev.onearmy.world](https://dev.onearmy.world)                         | [community.preciousplastic.com](https://community.preciousplastic.com) |
| Project Kamp     | [dev.community.projectkamp.com](https://dev.community.projectkamp.com) | [community.projectkamp.com](https://community.projectkamp.com)         |
| Fixing Fashion   | [dev.community.fixing.fashion](https://dev.community.fixing.fashion)   | [community.fixing.fashion](https://community.fixing.fashion)           |

## 🤓 &nbsp; Javascript style guide

As this is a large project spread across many developers it is important that the code is both clean and consistent. We use the Prettier style guide to enforce certain conventions through the linting system – if using VSCode (which we highly recommend) it is recommended that you install and setup the [prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to track errors in real time.

We also expect code to follow standard best practices, such as sensible variable naming, informative comments and avoiding files larger than a couple hundred lines of code (with emphasis on usability and reusability).

Running `yarn format` from the project root prior to committing will ensure the code you're adding is formatted to align with the standards of this project.

## 🔬 &nbsp; Commit style guide

To help everyone with understanding the commit history of this project and support our automated release tooling the following commit rules are enforced.

- commit message format of `$type($scope): $message`, for example: `docs: add commit style guide`
- maximum of 100 characters

For those of you who work with [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), this project offers a [husky](https://github.com/typicode/husky) commit message as well.

Here's a more detailed explanation of how you can format the commit message heading:

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope (optional): platform|docs|storybook|functions|scripts
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

## Writing Tests for Pull Requests

Writing tests is crucial for maintaining a robust and reliable codebase. Tests provide a safety net that helps catch errors and unintended behaviour changes before they reach production. By submitting tests with your pull request, you:

- Ensure stability: Tests verify that your contribution doesn’t break existing functionality.
- Facilitate review: Tests demonstrate the intended behaviour, making the review process smoother and more efficient.
- Document code: Tests serve as examples, illustrating how your code is supposed to work.

Test Writing Guidelines:

- Write meaningful tests: Focus on testing significant aspects and edge cases, not just writing tests for the sake of coverage.
- Follow the testing style: Adhere to the testing conventions and styles established in the project.
- Update existing tests: If your changes affect existing functionality, update the corresponding tests to reflect the new behaviour.

How to Add Tests:

1. Locate the test folder: Navigate to the appropriate directory containing existing tests.
2. Create a test file: If a test file for the modified module doesn’t exist, create one.
3. Write your tests: Following the project’s testing conventions, write tests that cover your changes.
4. Run tests locally: Before submitting, run tests locally to ensure they pass.
5. Submit with confidence: Include your tests in the pull request along with your changes.

Read more about testing in the [Testing Overview](https://onearmy.github.io/community-platform/Testing/overview)

## 🤝 &nbsp; Joining the team

We are always open to have more people involved. If you would like to contribute more often, we would love to welcome you to the team. [Join us on Discord](https://discord.gg/gJ7Yyk4) and checkout the [development](https://discord.com/channels/586676777334865928/938781727017558018) channel. Feel free to introduce yourself and outline:

1. How much time you feel you can dedicate to the project
2. Any relevant experience working with web technologies

We ask this so that we can better understand how you might fit in with the rest of the team, and maximise your contributions.

### 😖 Why haven't you used [insert favourite language/framework/convention here]

As an open-source project most of our decisions up till now have been guided by the people writing the code and conversations with people in our community whose opinions we value and respect. Some things are by careful design after the result of lengthy discussions, others are individual preference with few complaints to date. As we both want to encourage input from newer contributors but also want to avoid getting bogged down in circular or repetitive debates we encourage you to:

1. Start with an observation - instead of asking 'do you use redux' take a look at the `package.json` and see for yourself.
2. See if this is something we've already talked about - we tracked some initial discussions here [PPv4 - Web Platform Discussions](https://docs.google.com/document/d/1spUOUXvisHoTvvH8UDgFo1-pOi8PBsb1F8H2GRaH4IM/edit?usp=sharing), otherwise discussions take place across GitHub.
3. State what you believe the benefits to the project would be - _'because I've used it before and like it'_ isn't good enough! Do your research, evaluate common alternatives (in the very least google '[my awesome thought] vs X' and read the first few articles. Try to present a balanced argument for why we might want to/not want to use something.
4. Be willing to support implementation - any great idea or suggestion will have direct impact on others contributing to the project. If there is something you feel strongly about you should first create a clean, clear demo of how it would work in practice, and be willing to provide additional guidance if called upon.
