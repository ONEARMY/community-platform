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

#### Recognising Contributors

We have adopted [all contributors](https://allcontributors.org/) and their tooling for managing the contributors listing on the [project README.md](https://github.com/ONEARMY/community-platform/blob/master/README.md).

After merging a new contributors PR:

1. Add a comment to the merged PR mentioning the bot, contributor and their contribution [type](https://allcontributors.org/docs/en/emoji-key), for example: `@all-contributors add @username for code`.
2. A PR will be automatically raised, [example](https://github.com/ONEARMY/community-platform/pull/1952).
3. The PR raised by the `All Contributors` bot will need to be merged with admin privileges as the required CI skips are deliberately skipped.

### Payment

There is a hourly pay for Maintainers. Aimed at developers who help more consistently. If you're interested to become a maintainer feel free to reach out on [Discord](https://discord.gg/gJ7Yyk4).
