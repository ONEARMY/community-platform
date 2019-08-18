import { css } from 'styled-components'

const fonts = {
  primary: '"Varela Round", Arial, sans-serif;',
}

const fontsFaces = css`
    @font-face {
        font-family: 'Varela Round';
        src: url('/fonts/VarelaRound-Regular.eot');
        src: url('/fonts/VarelaRound-Regular-webfont.woff') format('woff'),
                url('/fonts/VarelaRound-Regular-webfont.ttf') format('truetype')
        font-weight: normal;
        font-style: normal;
    }
`

const fontSizes = [10, 12, 14, 18, 22, 30, 38, 42, 46, 50, 58, 66, 74]

export { fonts, fontsFaces, fontSizes }
