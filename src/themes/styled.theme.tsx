export const colors = {
  white: 'white',
  black: 'black',
  blue: '#b6d8e6',
  blue2: '#3f51b5',
  blue3: '#2d5786',
  green: '#88e3c7',
  yellow: '#ffe495',
  grey: '#dddddd',
  grey2: '#9b9b9b',
  grey3: '#656565',
  grey4: '#E9E9E9',
  greyStroke: '#AEAEAE',
  greyTag: '#4a4a4a',
  greyBg: '#F6F6F6',
  error: '#f44336',
}

export const buttons = {
  height: '40px',
  primary: {
    color: colors.black,
    backgroundColor: colors.white,
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
}

export const space = [0, 4, 8, 16, 32, 64, 128]

export const radii = space

export const fontSizes = [10, 12, 15, 18, 24, 32, 40, 56, 72]

export const breakpoints = ['32em', '48em', '64em']

export const maxContainerWidth = 1280

export const regular = 400

export const bold = 600

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
