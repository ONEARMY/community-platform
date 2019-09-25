import { lighten } from 'polished'
import { color } from '@storybook/addon-knobs'
// use enum to specify list of possible colors for typing
export const colors = {
  white: 'white',
  black: '#1b1b1b',
  yellow: { base: '#fee77b', hover: '#ffde45' },
  blue: '#83ceeb',
  red: '#eb1b1f',
  softblue: '#e2edf7',
  bluetag: '#5683b0',
  grey: '#61646b',
  error: 'red',
  background: '#f4f6f7',
}

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'disabled'
  | 'dark'
  | 'light'

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
const breakpoints = ['32em', '48em', '64em']
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
      backgroundColor: lighten(0.02, colors.softblue),
    },
    borderRadius: radii[1] + 'px',
  },
  imageInput: {
    border: '2px dashed #e0e0e0',
    color: '#e0e0e0',
    backgroundColor: 'transparent',
  },
}

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
