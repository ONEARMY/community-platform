import { darken, lighten } from 'polished'
import colors from './colors'
import { fonts } from './fonts'

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'disabled'
  | 'dark'
  | 'light'

const buttons = {
  primary: {
    fontFamily: fonts.primary,
    border: '2px solid ' + colors.black,
    color: colors.black,
    backgroundColor: colors.primary,
    padding: '15px',
    transition: '.2s ease-in-out',
    '&:hover': {
      backgroundColor: darken(0.08, colors.primary),
      transform: 'translateY(-5px)',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  secondary: {
    fontFamily: fonts.primary,
    border: '2px solid ' + colors.black,
    color: colors.black,
    backgroundColor: colors.secondary,
    transition: '.2s ease-in-out',
    '&:hover': {
      backgroundColor: lighten(0.03, colors.secondary),
      transform: 'translateY(-5px)',
    },
    '&:focus': {
      outline: 'none',
    },
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

export default buttons
