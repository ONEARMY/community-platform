import { createGlobalStyle } from 'styled-components'
import theme from 'src/themes/styled.theme'

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: system;
    font-style: normal;
    src: local(".SFNSText"), local(".HelveticaNeueDeskInterface"), local(".LucidaGrandeUI"), local("Ubuntu"), local("Segoe UI"), local("Roboto"), local("DroidSans"), local("Tahoma");
  }
  body {
      font-family: "system";
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
