import { createGlobalStyle } from 'styled-components'
import { colors } from 'src/themes/styled.theme'

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: system;
    font-style: normal;
    src: local(".SFNSText"), local(".HelveticaNeueDeskInterface"), local(".LucidaGrandeUI"), local("Ubuntu"), local("Segoe UI"), local("Roboto"), local("DroidSans"), local("Tahoma");
  }
  body {
      font-family: "system";
      background-color: ${colors.greyBg};
      margin: 0;
      padding: 0;
  }
  a {
    text-decoration: none;
  }
`
