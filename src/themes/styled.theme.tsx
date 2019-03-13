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
  greyTag: '#4a4a4a',
  greyBg: '#ededed',
  error: '#f44336'
}

export const buttons = {
  primary: {
    color: colors.white,
    backgroundColor: colors.blue,
  },
  outline: {
    color: colors.black,
    border: '1px solid ' + colors.black,
    backgroundColor: 'none',
  },
  disabled: {
    color: colors.grey,
    backgroundColor: colors.black,
  },
}

export const space = [0, 4, 8, 16, 32, 64, 128]

export const radii = space

export const fontSizes = [12, 14, 16, 20, 24, 32, 40, 56, 72]

export const maxContainerWidth = 1280

export default {
  colors,
  buttons,
  space,
  radii,
  fontSizes,
  maxContainerWidth,
}
