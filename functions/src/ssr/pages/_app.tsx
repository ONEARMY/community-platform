import { createGlobalStyle, ThemeProvider } from 'styled-components'
import Head from 'next/head'

const colors = {
  white: 'white',
  offwhite: '#ececec',
  black: '#1b1b1b',
  primary: 'green',
  softyellow: '#f5ede2',
  yellow: { base: '#fee77b', hover: '#ffde45' },
  blue: '#83ceeb',
  red: '#eb1b1f',
  red2: '#f58d8e',
  softblue: '#e2edf7',
  bluetag: '#5683b0',
  grey: '#61646b',
  green: '#00c3a9',
  error: 'red',
  background: '#f4f6f7',
  silver: '#c0c0c0',
  softgrey: '#c2d4e4',
  lightgrey: '#ababac',
}

export const zIndex = {
  behind: -1,
  level: 0,
  default: 1,
  slickArrows: 100,
  modalProfile: 900,
  logoContainer: 999,
  mapFlexBar: 2000,
  header: 3000,
  modalBackdrop: 4000,
  modalContent: 5000,
}

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'disabled'
  | 'dark'
  | 'light'
  | 'subtle'

const space = [
  0,
  5,
  10,
  15,
  20,
  25,
  30,
  35,
  40,
  45,
  50,
  55,
  60,
  65,
  70,
  75,
  80,
  85,
  90,
  95,
  100,
  105,
  110,
  115,
  120,
  125,
  130,
  135,
  140,
]
const radii = space
const fontSizes = [10, 12, 14, 18, 22, 30, 38, 42, 46, 50, 58, 66, 74]
const breakpoints = ['40em', '52em', '70em']
// standard widths: 512px, 768px, 1024px
const maxContainerWidth = 1280
const regular = 400
const bold = 600
// cc - assume standard image widths are 4:3, however not clearly defined

const buttons = {
  primary: {
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: '2px solid ' + colors.black,
    color: colors.black,
    bg: colors.yellow.base,
    transition: '.2s ease-in-out',
    '&:hover': {
      bg: colors.yellow.hover,
      cursor: 'pointer',
    },
    '&[disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&[disabled]:hover': {
      bg: colors.yellow.base,
    },
    borderRadius: radii[1] + 'px',
  },
  secondary: {
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: '2px solid ' + colors.black,
    color: colors.black,
    display: 'flex',
    bg: colors.softblue,
    transition: '.2s ease-in-out',
    '&:hover': {
      bg: colors.white,
      cursor: 'pointer',
    },
    '&[disabled]': {
      opacity: 0.5,
    },
    '&[disabled]:hover': {
      bg: colors.softblue,
    },
    borderRadius: radii[1] + 'px',
  },
  tertiary: {
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: '2px solid ' + colors.black,
    color: colors.black,
    display: 'flex',
    bg: colors.white,
    transition: '.2s ease-in-out',
    '&:hover': {
      bg: colors.red,
      cursor: 'pointer',
    },
    '&[disabled]': {
      opacity: 0.5,
    },
    '&[disabled]:hover': {
      bg: colors.white,
    },
    borderRadius: radii[1] + 'px',
  },

  outline: {
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: '2px solid ' + colors.black,
    color: colors.black,
    backgroundColor: colors.white,
    transition: '.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    height: 'fit-content',
    '&:hover': {
      backgroundColor: colors.softblue,
      cursor: 'pointer',
    },
    borderRadius: radii[1] + 'px',
  },
  imageInput: {
    border: '2px dashed #e0e0e0',
    color: '#e0e0e0',
    backgroundColor: 'transparent',
  },
  colorful: {
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: '2px solid ' + colors.black,
    color: colors.black,
    display: 'flex',
    bg: colors.white,
    transition: '.2s ease-in-out',
    '&:hover': {
      bg: colors.yellow.base,
      cursor: 'pointer',
    },
    '&[disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&[disabled]:hover': {
      bg: colors.yellow.base,
    },
    borderRadius: radii[1] + 'px',
  },
  subtle: {
    fontFamily: '"Varela Round", Arial, sans-serif',
    border: 'none',
    color: colors.black,
    display: 'flex',
    bg: colors.softblue,
    transition: '.2s ease-in-out',
    '&:hover': {
      bg: colors.white,
      cursor: 'pointer',
    },
    '&[disabled]': {
      opacity: 0.5,
    },
    '&[disabled]:hover': {
      bg: colors.softblue,
    },
    borderRadius: radii[1] + 'px',
  },
}

const typography = {
  auxiliary: {
    fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
    fontSize: '12px',
    color: colors.grey,
  },
  paragraph: {
    fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
    fontSize: '16px',
    color: colors.grey,
  },
}

const theme = {
  name: 'Precious Plastic',
  bold,
  breakpoints,
  buttons,
  colors,
  fontSizes,
  maxContainerWidth,
  radii,
  regular,
  space,
  typography,
  zIndex,
}

const GlobalStyle = createGlobalStyle`
body {
    font-family: "Varela Round", Arial, sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
}
a {
  text-decoration: none;
}
* {
  box-sizing: border-box;
  outline: 10px solid rgba(255,0,0,.2);
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

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Varela+Round&display=optional"
          rel="stylesheet"
        />
        <title>SSR rendered content</title>
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
