import { RenderFunction } from '@storybook/react'
import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../src/themes/styled.theme'

export default (storyFn: RenderFunction) => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
)
