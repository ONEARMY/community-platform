import { createGlobalStyle } from 'styled-components'
import { colors } from 'src/themes/styled.theme'

export const GlobalStyle = createGlobalStyle`
  body {
      background-color: ${colors.greyBg};
  }
  a {
    text-decoration: none;
  }
`
