// use enum to specify list of possible colors for typing
export enum colors {
  white = 'white',
  black = 'black',
  darkgrey = '#333333',
  lightgrey = '#f6f6f6',
  grey = '#dddddd',
  grey2 = '#9b9b9b',
  grey4 = '#E9E9E9',
  greyStroke = '#AEAEAE',
  green = '#88e3c7',
  yellow = '#ffe495',
  error = '#f44336',
  background = '#f6f6f6',
  primary = 'black',
  secondary = '#FF9900',
}

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'disabled'
  | 'dark'
  | 'light'

const buttons = {
  height: '40px',
  primary: {
    color: colors.primary,
    backgroundColor: colors.white,
  },
  secondary: {
    color: colors.white,
    backgroundColor: colors.secondary,
  },
  outline: {
    color: colors.black,
    border: '1px solid ' + colors.greyStroke,
    backgroundColor: 'white',
  },
  disabled: {
    color: colors.grey,
    backgroundColor: colors.black,
    opacity: 0.3,
  },
  dark: {
    color: colors.white,
    backgroundColor: colors.black,
  },
  light: {
    backgroundColor: colors.lightgrey,
    color: colors.black,
  },
}

const space = [0, 4, 8, 16, 32, 64, 128]
const radii = space
const fontSizes = [10, 12, 15, 18, 24, 32, 40, 56, 72]
const breakpoints = ['32em', '48em', '64em']
const maxContainerWidth = 1280
const regular = 400
const bold = 600

export default {
  colors,
  buttons,
  breakpoints,
  space,
  radii,
  fontSizes,
  maxContainerWidth,
  regular,
  bold,
}
