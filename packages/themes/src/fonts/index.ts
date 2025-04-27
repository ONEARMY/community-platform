import InterRegular_ttf from '../../assets/fonts/Inter-Regular.ttf'
import InterRegular_woff from '../../assets/fonts/Inter-Regular.woff'
import InterRegular_woff2 from '../../assets/fonts/Inter-Regular.woff2'
import InterSemiBold_ttf from '../../assets/fonts/Inter-SemiBold.ttf'
import InterSemiBold_woff2 from '../../assets/fonts/Inter-SemiBold.woff2'
import VarelaRound_ttf from '../../assets/fonts/VarelaRound-Regular.ttf'
import VarelaRound_woff from '../../assets/fonts/VarelaRound-Regular.woff'

// declare global styling overrides (fonts etc.)

export const GlobalFonts = `
  @font-face {
    font-family: 'Varela Round';
    font-display: auto;
    src:  url("${VarelaRound_woff}") format('woff'),
          url("${VarelaRound_ttf}") format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Inter';
    font-display: auto;
    src:  url("${InterRegular_woff2}") format('woff2'),
          url("${InterRegular_woff}") format('woff'),
          url("${InterRegular_ttf}") format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Inter';
    font-display: auto;
    src:  url("${InterSemiBold_woff2}") format('woff2'),
          url("${InterSemiBold_ttf}") format('truetype');
    font-weight: bold;
    font-style: normal;
  }
`
