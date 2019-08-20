import { createGlobalStyle } from 'styled-components'
import theme from 'src/themes/styled.theme'

export const GlobalStyle = createGlobalStyle`

  @font-face {
    font-family: 'Varela Round';
    src: url('/fonts/VarelaRound-Regular.eot');
    src: url('/fonts/VarelaRound-Regular-webfont.woff') format('woff'),
            url('/fonts/VarelaRound-Regular-webfont.ttf') format('truetype')
    font-weight: normal;
    font-style: normal;
  }
  
  body {
      font-family: "Varela Round", Arial, sans-serif;
      background-color: ${theme.colors.background};
      margin: 0;
      padding: 0;
      min-height: 100vh;
  }
  a {
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`
