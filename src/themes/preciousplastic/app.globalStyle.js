import { createGlobalStyle } from 'styled-components'
import theme from 'src/themes/styled.preciousplastic'

export const GlobalStyle = createGlobalStyle`
    ${theme.fontsFaces}

    body {
        font-family: ${theme.fonts.primary};
        background-color: ${theme.colors.background};
        margin: 0;
        padding: 0;
        min-height: 100vh;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
    }

    a {
        text-decoration: none;
    }

    * {
        box-sizing: border-box;
    }
`
