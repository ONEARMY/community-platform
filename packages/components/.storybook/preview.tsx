import { ThemeProvider } from 'theme-ui'
import type { Preview } from '@storybook/react'

import { Global } from '@emotion/react'
import { GlobalStyles } from '../src/GlobalStyles/GlobalStyles'

import {
  preciousPlasticTheme,
  projectKampTheme,
  fixingFashionTheme,
} from 'oa-themes'

import { MemoryRouter } from 'react-router-dom'

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
    (Story, context) => (
      <>
        <Global styles={GlobalStyles} />
        <MemoryRouter>
          <ThemeProvider theme={themes[context.globals.theme]}>
            <Story />
          </ThemeProvider>
        </MemoryRouter>
      </>
    ),
  ],
}

export default preview
