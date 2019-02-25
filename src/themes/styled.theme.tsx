export const colors = {
  white: 'white',
  black: 'black',
  blue: '#b6d8e6',
  green: '#88e3c7',
  yellow: '#ffe495',
  grey: '#dddddd',
  grey2: '#9b9b9b',
  grey3: '#656565',
  greyTag: '#4a4a4a',
  greyBg: '#ededed',
}

export const buttons = {
  primary: {
    color: colors.black,
    backgroundColor: colors.blue,
  },
  outline: {
    color: colors.black,
    border: '1px solid ' + colors.black,
    backgroundColor: 'none',
  },
}

export const space = [0, 4, 8, 16, 32, 64, 128]

export default {
  colors,
  buttons,
  space,
}
