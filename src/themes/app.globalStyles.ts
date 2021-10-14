import { createGlobalStyle } from 'styled-components'

import { GlobalFonts } from './fonts'
// declare global styling overrides (fonts etc.)

export const GlobalStyle = createGlobalStyle`
  ${GlobalFonts}

  body {
      font-family: "Varela Round", Arial, sans-serif;
      background-color: ${props => props.theme.colors.background};
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
    z-index: ${props => props.theme.zIndex.slickArrows};
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
