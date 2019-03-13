# Contribution Guidelines

## 👊 &nbsp; How to contribute

1. Thanks already!
2. Pick an issue. We've labeled some of them with `Good-first-issue` to help you find the more accessible ones to start with.
3. In the issue you chose to work on comment to let us know you’re working on it (to avoid two people doing the same thing). The comment should include a mention to @mattia-io (our project lead).
4. Fork the project, or make a new feature branch from the master branch
5. Do your magic, and make sure your git branch is up to date
6. Make a pull request back to our master branch
7. Our core team reviews contributors' pull requests on tuesday (sometimes earlier 🤫)

Note: If you can’t find anything in our todo list that you can help with, it’s probably because we haven’t defined it yet. There’s lots of stuff to do, so if you think you can help out, let us know and we’ll find you something.

## 👐 &nbsp; Code of Conduct

This project and everyone participating in it is governed by the [One Army Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [hello@onearmy.world](mailto:hello@onearmy.world).

## 📟 &nbsp; Getting started

- Fork the repository
- Clone the projet from the fork you have created previously at first step :
  `git clone https://github.com/`**your-github-user**`/onearmy.git`

- Install dependencies
  `yarn`

- Run the dev server
  `yarn start`

- Run Storybook
  `yarn storybook`

Note: Builds are currently tested on Chrome/Firefox. If your browser is not
supported, then consider contributing :-)

## 🏠 &nbsp; Project Structure

The project is split across **pages** which make up the visual routing of the application. Within pages there are **components**, some of which are specific to the page and others which are shared.

Typescript **models** that relate to general data flow (such as a user’s profile) are within the models folder, whilst component states and properties are declared within the component. Artificial data for use in development is held in the **mocks** folder, with live data requests handled within **api**.

In addition app state, actions and dispatchers are handled within the **stores** folder, whilst global state property mapping is dealt in page components.

## 🤖 &nbsp; Technologies

### Frontend

The platform is built in **React** and [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html) for typing and consistency, [styled-components](https://www.styled-components.com/) for reusability and component based styling.
We created a frontend guide to explain our choices and best practice in building the One Army interface. This guide is available in [the wiki](https://github.com/OneArmyWorld/onearmy/wiki/Frontend)

### Backend

Our backend contains microservices in Node and is based on Firebase's Firestore to manage our database.
You can find usefull links to learn more about these technologies [here](/CONTRIBUTING.md#ressources)

## 🌳 &nbsp; Branch Structure

We have two main branches linked to production and development sites, you should always start with the **master** branch as this contains the most up-to-date code, and will be where pull requests are made to for review. The **production** branch contains the live production site, and will be merged from master after regular review periods.

We use additional branches to define a specific feature or issue group being worked on. An example might be work on the home page, which would be done in the ‘#19 home-page’ branch (where #19 refers to the issue number describing what needs to be done). These branches are ephemeral, and so removed after merging into the master branch and closing the issue. Generally it is expected that only 1 developer will be working on a given branch, and it is that developer’s responsibility to create the branch, manage pull requests, reviews or ask for additional support when needed.

## 🚀 &nbsp; Deployment

Master is our current development leading branch, and will autodeploy to the
[development site](https://dev.onearmy.world/). When things are production
ready, they will be pushed to the master branch which ends up on the [live
site](https://onearmy.world/).

## 💌 &nbsp; Epics and User stories

As the project will get quite complex we use **Epics and User stories** to break down functionalities into smaller action items that can be worked on from our distributed team of contributors (remote and inhouse).
More in details:

- **Epics** are pages and complex pieces of functionality.
- **User Stories** break down epics into tiny, actionable items that are easier to take on for devs both remote or on site.

If you’re interested, [here](https://docs.google.com/spreadsheets/d/1pkLRKCbQiJOtQwWEhVNgSTvDWf5SnVAz10vMo4k-LNg/edit#gid=0) you can find a backlog document outlining the full list of upcoming **Epics** and relevant **User Stories** waiting to be developed. Project lead @mattia-io will transfer User Stories from here to Waffle where they're called **Issues**.

Anyone can pick an **Issue** from [Waffle](https://waffle.io/OneArmyWorld/onearmy) and get on with coding. When working on an **Issue** you should comment on the issue with your name, delivery date, plus a mention to Mattia (@mattia-io). This way we can be aware of what is being worked on and when issues are due for delivery. If upon assigning yourself an **Issues** you find that you are unable to contribute to it we kindly ask you to let @mattia-io know on the same **Issues** (max 2 weeks).

## 🐛 &nbsp; Issue Tracking and Management

Issues are tracked on GitHub and we also use [waffle](https://waffle.io) as a visual overlay to monitor progression. Some issues are collated to form **Epics** which are a more general narrative or story for what the intended development will result in for a user, and **Issues** may also have further child issues. If you are unfamiliar with ways to format or format issues, then refer to the links [here](https://github.com/OneArmyWorld/onearmy/issues/2).

Anybody can create an issue or assign an issue to themselves (can't assign on Waffle, in this case you should comment your name), and when working on an issue it should be tagged with **in-progress** (on Waffle @mattia-io will take care of this) so that we are aware of what is being worked on. Once an issue is in progress we expect some sort of update to be made within a 1-2 week period (otherwise you should unmark, and possibly unassign if unlikely to come back to it soon).

When a group of issues has been resolved a pull request to the dev branch should be made, where it will undergo a quick review and test. It is expected that the developer will have done through testing themselves first, and most pull requests can be quickly merged.

## 🤓 &nbsp; Javascript style guide

As this is a large project spread across many developers it is important that not only code is clean but also consistent. We use the prettier style guide to enforce certain conventions through the linting system – if using VSCode it is recommended that you include the [prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to track errors in real time.

We also expect code to follow standard good practice, such as sensible variable naming, informative comments and avoiding files large than a couple hundred lines of code (emphasis on usability and reusability).

### 😖 Why haven't you used [insert favourite language/framework/convention here]

As an open-source project most of our decisions up till now have been guided by the people writing the code and conversations with people in our community whose opinions we value and respect. Some things are by careful design after the result of lengthy discussion, others are just individual preference with few complaints to dates. As we both want to encourage input from newer contributors but also avoid getting too bogged down in circular or repeated debates we encourage you to:

1. Start with an observation - instead of asking 'do you use redux' take a look at the package and see for yourself.
2. See if this is something we've already talked about - we tracked some initial discussions in the google doc [PPv4 - Web Platform Discussions](https://docs.google.com/document/d/1spUOUXvisHoTvvH8UDgFo1-pOi8PBsb1F8H2GRaH4IM/edit?usp=sharing), and are trying to add more of the ongoing discussions to the [GitHub Wiki](https://github.com/OneArmyWorld/onearmy/wiki). There is also plenty more within Slack v4-website-dev channel, which we hope to slowly migrate onto the wiki.
3. Clearly state what you believe the benefits to the project would be - simply 'because I've used it before and like it' isn't good enough! Do your research, evaluate common alternatives (in the very least google '[my awesome thought] vs ' and read the first few articles. Try to present a balanced argument for why we might want to/not want to use something.
4. Be willing to support implementation - any great idea or suggestion will have direct impact on others contributing to the project. If there is something you feel strongly about you should first create a clean, clear demo of how it would work in practice, and be willing to provide additional guidance if called upon.

## 🤝 &nbsp; Joining the team

We are always open to have more people involved. If you would like to contribute more often, we would love to welcome you to the team. Just [send a quick email](mailto:hello@preciousplastic.com?subject=Developers%20Call%20To%20Arms), introducing yourself and outline:

1. Your experience working with the technologies listed above
2. How much time you feel you can dedicate to the project

We ask this so that we can better understand how you might fit in with the rest of the team, and maximise your contributions. From here we will then connect you to the github repository as well as slack channel which we use to handle regular communication.

## 📚 &nbsp; Resources

- https://www.udemy.com/react-redux/
  paid online course to cover most of the basics of React - it uses redux where we use mobx but rest is still very good

* https://levelup.gitconnected.com/typescript-and-react-using-create-react-app-a-step-by-step-guide-to-setting-up-your-first-app-6deda70843a4
  short intro app for typescript and react

* https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
  react-mobx-typescript example

* https://medium.com/get-it-working/get-googles-firestore-working-with-react-c78f198d2364 react-firestore example

- https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
  Example using firebase auth with react and linking redux state
