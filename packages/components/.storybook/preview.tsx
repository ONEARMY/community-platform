import { ThemeProvider } from '@emotion/react'
import type { Preview } from '@storybook/react'
import React from 'react'

import { Global } from '@emotion/react'
import { GlobalStyles } from '../src/GlobalStyles/GlobalStyles'

import {
  preciousPlasticTheme,
  projectKampTheme,
  fixingFashionTheme,
} from 'oa-themes'

import {
  Route,
  RouterProvider,
  createMemoryRouter,
  createRoutesFromElements,
} from 'react-router-dom'

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
      const router = createMemoryRouter(
        createRoutesFromElements(<Route index element={<Story />}></Route>),
      )
      return (
        <>
          <Global styles={GlobalStyles} />
          <ThemeProvider theme={themes[context.globals.theme]}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </>
      )
    },
  ],
}

export default preview
