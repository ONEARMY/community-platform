import InterRegular_woff from '../../../../src/assets/fonts/Inter-Regular.woff';
import InterRegular_woff2 from '../../../../src/assets/fonts/Inter-Regular.woff2';
import InterSemiBold_woff2 from '../../../../src/assets/fonts/Inter-SemiBold.woff2';
import KlimaRegular_woff from '../../../../src/assets/fonts/Klima-Regular.woff';
import KlimaRegular_woff2 from '../../../../src/assets/fonts/Klima-Regular.woff2';
import VarelaRoundHebrew_woff2 from '../../../../src/assets/fonts/VarelaRound-Regular-hebrew.woff2';
import VarelaRoundLatin_woff2 from '../../../../src/assets/fonts/VarelaRound-Regular-latin.woff2';
import VarelaRoundLatinExt_woff2 from '../../../../src/assets/fonts/VarelaRound-Regular-latin-ext.woff2';
import VarelaRoundVietnamese_woff2 from '../../../../src/assets/fonts/VarelaRound-Regular-vietnamese.woff2';

// declare global styling overrides (fonts etc.)

export const GlobalFonts = `
  @font-face {
    font-family: 'Varela Round';
    font-display: swap;
    src:  url("${VarelaRoundLatin_woff2}") format('woff2');
    font-weight: normal;
    font-style: normal;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Varela Round';
    font-display: swap;
    src:  url("${VarelaRoundLatinExt_woff2}") format('woff2');
    font-weight: normal;
    font-style: normal;
    unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }

  @font-face {
    font-family: 'Varela Round';
    font-display: swap;
    src:  url("${VarelaRoundVietnamese_woff2}") format('woff2');
    font-weight: normal;
    font-style: normal;
    unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
  }

  @font-face {
    font-family: 'Varela Round';
    font-display: swap;
    src:  url("${VarelaRoundHebrew_woff2}") format('woff2');
    font-weight: normal;
    font-style: normal;
    unicode-range: U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F;
  }

  @font-face {
    font-family: 'Inter';
    font-display: swap;
    src:  url("${InterRegular_woff2}") format('woff2'),
          url("${InterRegular_woff}") format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Inter';
    font-display: swap;
    src:  url("${InterSemiBold_woff2}") format('woff2');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'Klima';
    font-display: swap;
    src:  url("${KlimaRegular_woff2}") format('woff2'),
          url("${KlimaRegular_woff}") format('woff');
    font-weight: normal;
    font-style: normal;
  }
`;
