import { createGlobalStyle } from 'styled-components'
import theme, { zIndex } from 'src/themes/styled.theme'

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

  .slick-prev,
  .slick-next {
    position: absolute;
    top: 50%;
    z-index: ${zIndex.slickArrows};
    transform: translateY(-50%);
    cursor: pointer;
  }

  .slick-next {
    left: auto;
    right: 0;
  }

  .slick-prev {
    left: 0;
    right: auto;
    
  }

  .slick-track {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  /***** Fix for Algolia search Icon *******/
  .ap-icon-pin {
    display: none;
  }

  /* Screen-reader text only - Taken from bootstrap 4 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }
`
