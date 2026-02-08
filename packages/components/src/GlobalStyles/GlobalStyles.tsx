import { css } from '@emotion/react';
import { commonStyles, GlobalFonts } from 'oa-themes';

export const GlobalStyles = css`
  ${GlobalFonts}
  html {
    overflow-y: scroll;
  }
  body {
    font-family: 'Varela Round', Arial, sans-serif;
    background-color: ${commonStyles.colors.background};
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
    border: 4px dashed ${commonStyles.colors.betaGreen};
  }

  body:has(.beta-tester-feature) .user-beta-icon > span {
    background-color: ${commonStyles.colors.betaGreen};
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
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.4);
  }
  dialog {
    z-index: 4000;
  }
`;
