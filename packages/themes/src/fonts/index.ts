import VarelaRound_woff from '../../assets/fonts/VarelaRound-Regular.woff'
import VarelaRound_ttf from '../../assets/fonts/VarelaRound-Regular.ttf'

import InterRegular_woff2 from '../../assets/fonts/Inter-Regular.woff2'
import InterRegular_woff from '../../assets/fonts/Inter-Regular.woff'
import InterRegular_ttf from '../../assets/fonts/Inter-Regular.ttf'

import InterMedium_woff2 from '../../assets/fonts/Inter-Medium.woff2'
import InterMedium_woff from '../../assets/fonts/Inter-Medium.woff'
import InterMedium_ttf from '../../assets/fonts/Inter-Medium.ttf'

// declare global styling overrides (fonts etc.)

export const GlobalFonts = `
  @font-face {
    font-family: 'Varela Round';
    font-display: auto;
    src:  url(${VarelaRound_woff}) format('woff'),
          url(${VarelaRound_ttf}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Inter';
    font-display: auto;
    src:  url(${InterRegular_woff2}) format('woff2'),
          url(${InterRegular_woff}) format('woff'),
          url(${InterRegular_ttf}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Inter';
    font-display: auto;
    src:  url(${InterMedium_woff2}) format('woff2'),
          url(${InterMedium_woff}) format('woff'),
          url(${InterMedium_ttf}) format('truetype');
    font-weight: bold;
    font-style: normal;
  }
`
