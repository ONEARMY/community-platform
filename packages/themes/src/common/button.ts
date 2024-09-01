import type { ThemeWithName } from '../types'

const BASE_BUTTON = {
  fontFamily: '"Varela Round", Arial, sans-serif',
  fontSize: 3,
  display: 'inline-flex',
  cursor: 'pointer',
  alignItems: 'center',
  position: 'relative',
  transition: '.2s ease-in-out',
  borderRadius: 1,
  width: 'auto',
  border: '2px solid',
  height: '2.75rem',
}

export const getButtons = (colors: ThemeWithName['colors']) => ({
  primary: {
    ...BASE_BUTTON,
    color: colors.black,
    bg: colors.accent.base,
    '&:hover': {
      bg: colors.accent.hover,
    },
    '&[disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&[disabled]:hover': {
      bg: colors.accent.base,
    },
  },
  secondary: {
    ...BASE_BUTTON,
    border: '2px solid ' + colors.black,
    color: colors.black,
    bg: colors.softblue,
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
  },
  destructive: {
    ...BASE_BUTTON,
    border: '2px solid ' + colors.black,
    backgroundColor: colors.red2,
    color: colors.black,
    '&:hover': {
      backgroundColor: colors.white,
    },
  },
  outline: {
    ...BASE_BUTTON,
    border: '2px solid ' + colors.black,
    color: colors.black,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: colors.softblue,
    },
  },
  quiet: {
    ...BASE_BUTTON,
    border: '2px dashed ' + colors.grey,
    color: colors.grey,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: colors.background,
    },
    fontSize: 1,
  },
  imageInput: {
    border: '2px dashed #e0e0e0',
    color: '#e0e0e0',
    backgroundColor: 'transparent',
  },
  subtle: {
    ...BASE_BUTTON,
    borderColor: colors.softblue,
    color: colors.black,
    bg: colors.softblue,
    '&:hover': {
      bg: colors.offwhite,
      borderColor: colors.offwhite,
    },
    '&[disabled]': {
      opacity: 0.5,
    },
    '&[disabled]:hover': {
      bg: colors.softblue,
    },
  },
  breadcrumb: {
    ...BASE_BUTTON,
    padding: '1',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    height: 'auto',
    color: 'dimgray',
    fontSize: 15,
    '&:hover': {
      backgroundColor: colors.softblue,
      border: '1px solid ' + colors.lightgrey,
    },
  },
})

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'disabled'
  | 'subtle'
