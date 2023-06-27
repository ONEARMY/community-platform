import { css } from '@emotion/react'
import { preciousPlasticTheme, GlobalFonts } from 'oa-themes'
const theme = preciousPlasticTheme.styles

export const GlobalStyles = css`
  ${GlobalFonts}
  body {
    font-family: 'Varela Round', Arial, sans-serif;
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

  .beta-tester-feature {
    border: 4px dashed ${theme.colors.betaGreen};
  }

  body:has(.beta-tester-feature) .user-beta-icon > span {
    background-color: ${theme.colors.betaGreen};
  }

  .slick-prev,
  .slick-next {
    position: absolute !important;
    top: 50%;
    z-index: ${theme.zIndex.slickArrows};
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
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`
