---
id: maintainer
title: Maintainer Role
---

## Want to support the core project even more?

That's awesome! As well as the bounty system we also encourage anyone interested to join our Core Developers or Maintainers team.

These roles include tasks like:

- Code reviews
- Code quality improvements
- Devops and general optimisations
- Security and general updates
- Documentation
- Issue management

There is a separate hourly pay scale for these roles, aimed at developers who help a bit more consistently at around 2-3h per week. If you're interested in these roles then feel free to reach out on slack or during the monthly dev call.

### Merging PRs & Releasing Changes

Once a PR has gained all the necessary approval, the following steps should be taken to release the PR.

1. Merge the PR
2. A deployment will be triggered to the development environments.
3. Verify changes in the development environment
4. An automated Release PR will be generated
5. Approve and merge the Release PR
6. A deployment will be triggered to production environments.

### Recognising Contributors

We have adopted [all contributors](https://allcontributors.org/) and their tooling for managing the contributors listing on the [project README.me](https://github.com/ONEARMY/community-platform/blob/master/README.md).

After merging a new contributors PR:

1. Add a comment to the merged PR mentioning the bot, contributor and their contribution type, for example: `@all-contributors add @githubUsername for code`
2. A PR will be automatically raised, [example](https://github.com/ONEARMY/community-platform/pull/1952)
3. The PR raised by the All Contributors bot will need to be merged with admin privileges as the required CI skips are deliberately skipped.

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
