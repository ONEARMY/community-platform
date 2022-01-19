import { ThemeProvider } from 'styled-components'
import { addDecorator } from '@storybook/react'
import { withThemes } from '@react-theming/storybook-addon'

import { GlobalStyle } from '../../../src/themes/app.globalStyles'

import preciousPlasticTheme from '../../../src/themes/precious-plastic/styles'
import projectKampTheme from '../../../src/themes/project-kamp/styles'

// pass ThemeProvider and array of your themes to decorator
addDecorator(
  withThemes(ThemeProvider, [preciousPlasticTheme, projectKampTheme]),
)

addDecorator((story) => (
  <>
    <GlobalStyle/>
    {story()}
  </>
))

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
