# Introduction (for first timers)

Welcome to One Army! We’re excited to hear that you’re interested in supporting the development of our project. If you happened to just stumble across this, we are building a new platform to help unite people to support social causes, such as [Precious Plastic](https://preciousplastic.com) (which is where this all began) or [ProjectKamp](https://projectkamp.com/). A platform to connect, educate and empower a global community to solve society's greatest challenges. 

The platform is built in **React** (+ Mobx + Typescript), with backend microservices in Node. If you are unfamiliar with these technologies we suggest you first spend some time understanding how these frameworks function before getting in touch (as much as we’d love to be your teachers, we just don’t have the capacity to do that and build everything else). Here are a few links that might be of help on your journey:

- https://www.udemy.com/react-redux/
  paid online course to cover most of the basics of React - it uses redux where we use mobx but rest is still very good

* https://levelup.gitconnected.com/typescript-and-react-using-create-react-app-a-step-by-step-guide-to-setting-up-your-first-app-6deda70843a4
  short intro app for typescript and react

* https://medium.com/teachable/getting-started-with-react-typescript-mobx-and-webpack-4-8c680517c030
  react-mobx-typescript example

* https://medium.com/get-it-working/get-googles-firestore-working-with-react-c78f198d2364 react-firestore example

* https://mobx.js.org/index.html
  full documentation for mobx

* https://www.typescriptlang.org/docs/handbook/basic-types.html full documentation for typescript

* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
  Example using firebase auth with react and linking redux state

## Joining the community

Once you are confident with the basics of React, Mobx and Typescript we would love to welcome you to the team. Just [send a quick email](mailto:hello@preciousplastic.com?subject=Developers%20Call%20To%20Arms) , introducing yourself and outline:

1. What you think you could contribute to the project

2. How much time you feel you can dedicate
   We ask this so that we can better understand how you might fit in with the rest of the team, and maximise your contributions. From here we will then connect you to the github repository as well as slack channel which we use to handle regular communication.

# Contribution guidelines

## So how can I get started?

We first ask that you quickly read through the document below so that you are familiar with the overall structure and workflow, after which you will either be assigned or can self-assign a group of issues to work on.

## Project Structure

The project is split across **pages** which make up the visual routing of the application. Within pages there are **components**, some of which are specific to the page and others which are shared.

Typescript **models** that relate to general data flow (such as a user’s profile) are within the models folder, whilst component states and properties are declared within the component. Artificial data for use in development is held in the **mocks** folder, with live data requests handled within **api**.

In addition app state, actions and dispatchers are handled within the **redux** folder, whilst global state property mapping is dealt with either in **containers**, or page components.

## Branch Structure

We have two main branches linked to production and development sites, you should always start with the **Dev** branch as this contains the most up-to-date code, and will be where pull requests are made to for review. The **master** branch contains the live production site, and will be merged from dev after regular review periods.

We use additional branches to define a specific feature or issue group being worked on. An example might be work on the home page, which would be done in the ‘#19 home-page’ branch (where #19 refers to the issue number describing what needs to be done. These branches are ephemeral, and so removed after merging into the dev branch and closing the issue. Generally it is expected that only 1 developer will be working on a given branch, and it is that developer’s responsibility to create the branch, manage pull requests, reviews or ask for additional support when needed.

## Issue Tracking and Management

Issues are tracked on GitHub and we also use [waffle](https://waffle.io) as a visual overlay to monitor progression. Some issues are collated to form ‘Epics’ which are a more general narrative or story for what the intended development will result in for a user, and issues may also have further child issues. If you are unfamiliar with ways to format or format issues, then refer to the links [here](https://github.com/OneArmyWorld/onearmy/issues/2).

Anybody can create an issue or assign an issue to themselves, and when working on an issue it should be tagged with **in-progress** so that we are aware of what is being worked on. Once an issue is in progress we some sort of update to be made within a 1-2 week period (otherwise you should unmark, and possibly unassign if unlikely to come back to it soon).

When a group of issues has been resolved a pull request to the dev branch should be made, where it will undergo a quick review and test. It is expected that the developer will have done thorough testing themselves first, and most pull requests can be quickly merged.

## Javascript style guide

As this is a large project spread across many developers it is important that not only code is clean but also consistent. We use the prettier style guide to enforce certain conventions through the linting system – if using VSCode it is recommended that you include the [prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to track errors in real time.

We also expect code to follow standard good practice, such as sensible variable naming, informative comments and avoiding files large than a couple hundred lines of code (emphasis on usability and reusability).

## Css style guide

We use BEM naming convention for css, refer to [this example](https://medium.freecodecamp.org/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849) if your are not familiar with it.

## Visual style guide

(More details coming soon)

For now you should use [materialUI](https://material-ui.com/) components where possible, as these will form a basis for future design principles.
