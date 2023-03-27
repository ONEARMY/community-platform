import { ThemeProvider } from 'theme-ui'
import { addDecorator } from '@storybook/react'
import { withThemes } from '@react-theming/storybook-addon'

import { Global } from '@emotion/react'
import { GlobalStyles } from '../src/GlobalStyles/GlobalStyles'

import {
  preciousPlasticTheme,
  projectKampTheme,
  fixingFashionTheme,
} from 'oa-themes'

import { MemoryRouter } from 'react-router-dom'

// pass ThemeProvider and array of your themes to decorator
addDecorator(
  withThemes(ThemeProvider, [
    preciousPlasticTheme,
    projectKampTheme,
    fixingFashionTheme,
  ]),
)

addDecorator((story) => {
  return (
    <>
      <Global styles={GlobalStyles} />
      <MemoryRouter>{story()}</MemoryRouter>
    </>
  )
})

export const parameters = {
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
}
