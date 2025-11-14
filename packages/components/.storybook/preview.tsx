import { ThemeProvider } from '@theme-ui/core'
import type { Preview } from '@storybook/react-vite'
import React from 'react'

import { Global } from '@emotion/react'
import { GlobalStyles } from '../src/GlobalStyles/GlobalStyles'

import {
  preciousPlasticTheme,
  projectKampTheme,
  fixingFashionTheme,
} from 'oa-themes'
import { createRoutesStub } from 'react-router'

const themes = {
  pp: preciousPlasticTheme.styles,
  pk: projectKampTheme.styles,
  ff: fixingFashionTheme.styles,
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    options: {
      storySort: {
        order: ['Welcome'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Platform Theme',
      defaultValue: 'pp',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'pp', title: 'Precious Plastic' },
          { value: 'pk', title: 'Project Kamp' },
          { value: 'ff', title: 'Fixing Fashion' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const RouterStub = createRoutesStub([
        {
          path: '/',
          Component: () => (
            <>
              <Global styles={GlobalStyles} />
              <ThemeProvider theme={themes[context.globals.theme]}>
                <Story />
              </ThemeProvider>
            </>
          ),
        },
      ])

      return <RouterStub />
    },
  ],
}

export default preview
