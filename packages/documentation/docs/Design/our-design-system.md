---
id: our-design-system
title: Our Design System
---

# Our design system

Community Platform is a toolkit that is already being used for multiple web platforms today (including [community.preciousplastic.com](https://community.preciousplastic.com) and [community.projectkamp.com](https://community.projectkamp.com)), and we want it to be used on many more in the future.

Our design system can be summarized like so: improvement and feature ideas come in from Discord, which are then prototyped in Figma, built in code, and then documented in Storybook and our documentation site.

Our design system infrastructure has two main goals currently:

1. Work to catch up to the state of what has been built, documenting the Community Platform design system as it exists today so that team wishing to use the CP technology also have effective design tools.
2. Serve to prototype new features that are being created, ideating and communicating about how to enrich the platform.

We're looking for volunteers in either mission, so whether you love mocking up new features or wrangling a design system into order, we've got work for you 👩🏻‍💻. Here is an overview of our main design tools:

## Figma

We have an organization in Figma named ONE ARMY with one project for Community Platform, and within that project is one file named [ONE ARMY Community Platform](https://www.figma.com/file/nPDwFo0Ee4wcHvtnEGtAu9/ONE-ARMY-Community-Platform). In this file you'll find pages for the following:

1. Design System
2. Page Mockups
3. Features under development, denoted with a number
4. Empty slots

Figma at time of writing has a peculiar limitation on Free Team Projects, on the number of pages you can have in a file. We were able to keep all of the pages we had in our file when we migrated though, so we're consolidating our designs to a few pages to be able to make the most of our time in the free tier. Please please do not delete any empty slot pages if you're editing the file 🙏🏻.

## UI Kit in Storybook

We very recently broke out a [UI Kit documentation repository](https://github.com/ONEARMY/community-platform/blob/master/packages/components/README.md) separate from the Community Platform codebase! It uses Storybook to create interactive documentation with our real UI components.

This is a very new and important piece of making Community Platform easy for teams outside of the ONE ARMY ecosystem to use it, so if you're a technically-minded designer or UX professional, we are looking for help on our UI Kit in the following areas:

1. Documenting the state of the component library. Where are components used, what states are available, what dependencies do they have that aren't easy to see in the code?
2. Audit the component library. What duplicate components do we have? Are there gaps in our library that would be a must have for your organization to build a community with it?

## GitHub Docs Site

This documentation site for Community Platform is aimed at technical users, but it is core to our design system. Community Platform's main users are going to be organizations that want to build their own digitally-connected learning communities, and as such they are going to consist of design practitioners and technologists (or people wearing both of those hats). It is important that we have a well-paved two-way street between our design documentation and our technical documentation, between Figma, Storybook, and our docs site.

## Discord

This is where new design begins for Community Platform. We host beta testing and design feedback channels on [Discord](https://discord.gg/gJ7Yyk4) that are the source of a lot of improvements to the platform.
