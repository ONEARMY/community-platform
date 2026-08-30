import { css } from '@emotion/react';
import { commonStyles, GlobalFonts } from 'oa-themes';

export const GlobalStyles = css`
  ${GlobalFonts}
  body {
    font-family: 'Varela Round', Arial, sans-serif;
    background-color: ${commonStyles.colors.background};
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  .beta-tester-feature {
    border: 4px dashed ${commonStyles.colors.betaGreen};
  }

  body:has(.beta-tester-feature) .user-beta-icon > span {
    background-color: ${commonStyles.colors.betaGreen};
  }

  /* Form control focus styles - applies to Radio, Switch, Checkbox components */
  input:focus ~ [class^='css-'],
  input:focus ~ [class*=' css-'] {
    background-color: ${commonStyles.colors.white};
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.4);
  }
  dialog {
    z-index: 4000;
  }
`;
