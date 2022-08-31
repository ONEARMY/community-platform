import memberBadge from 'src/assets/images/themes/precious-plastic/badge-member.svg'
import memberBadgeLowDetail from 'src/assets/icons/map-member.svg'
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.svg'
import CollectionBadgeLowDetail from 'src/assets/icons/map-collection.svg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.svg'
import MachineBadgeLowDetail from 'src/assets/icons/map-machine.svg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.svg'
import WorkspaceBadgeLowDetail from 'src/assets/icons/map-workspace.svg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.svg'
import LocalComBadgeLowDetail from 'src/assets/icons/map-community.svg'
import logo from 'src/assets/images/precious-plastic-logo-official.svg'

import type { ThemeWithName } from '../types'

const fonts = {
  body: `'Inter', Arial, sans-serif`,
}

// use enum to specify list of possible colors for typing
export const colors = {
  white: 'white',
  offwhite: '#ececec',
  black: '#1b1b1b',
  primary: 'red',
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
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100, 105, 110, 115, 120, 125, 130, 135, 140,
]
const radii = space
const fontSizes = [10, 12, 14, 18, 22, 30, 38, 42, 46, 50, 58, 66, 74]
const breakpoints = ['40em', '52em', '70em']
// standard widths: 512px, 768px, 1024px
const maxContainerWidth = 1280
const regular = 400
const bold = 600
// cc - assume standard image widths are 4:3, however not clearly defined

const alerts = {
  success: {
    borderRadius: 1,
    paddingX: 2,
    paddingY: 3,
    backgroundColor: colors.green,
    textAlign: 'center',
  },
  failure: {
    borderRadius: 1,
    paddingX: 2,
    paddingY: 3,
    backgroundColor: colors.red2,
    textAlign: 'center',
  },
}

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

const StyledComponentTheme: ThemeWithName = {
  name: 'Precious Plastic',
  logo: logo,
  profileGuidelinesURL:
    'https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view',
  communityProgramURL:
    'https://community.preciousplastic.com/academy/guides/community-program',
  alerts,
  badges: {
    member: {
      lowDetail: memberBadgeLowDetail,
      normal: memberBadge,
    },
    workspace: {
      lowDetail: WorkspaceBadgeLowDetail,
      normal: WorkspaceBadge,
    },
    'community-builder': {
      lowDetail: LocalComBadgeLowDetail,
      normal: LocalComBadge,
    },
    'collection-point': {
      lowDetail: CollectionBadgeLowDetail,
      normal: CollectionBadge,
    },
    'machine-builder': {
      lowDetail: MachineBadgeLowDetail,
      normal: MachineBadge,
    },
  },
  bold,
  breakpoints,
  buttons,
  cards: {
    primary: {
      background: 'white',
      border: `2px solid ${colors.black}`,
      borderRadius: 1,
      overflow: 'hidden',
    },
  },
  colors,
  fonts,
  fontSizes,
  forms: {
    input: {
      background: colors.background,
      borderRadius: 1,
      border: '1px solid transparent',
      fontFamily: fonts.body,
      fontSize: 1,
      '&:focus': {
        borderColor: colors.blue,
        outline: 'none',
        boxShadow: 'none',
      },
    },
    inputOutline: {
      background: 'white',
      border: `2px solid ${colors.black}`,
      borderRadius: 1,
      '&:focus': {
        borderColor: colors.blue,
        outline: 'none',
        boxShadow: 'none',
      },
    },
    error: {
      background: colors.background,
      borderRadius: 1,
      border: `1px solid ${colors.error}`,
      fontFamily: `'Inter', Arial, sans-serif`,
      fontSize: 1,
      '&:focus': {
        borderColor: colors.blue,
        outline: 'none',
        boxShadow: 'none',
      },
    },
    textarea: {
      background: colors.background,
      border: `1px solid transparent`,
      borderRadius: 1,
      fontFamily: `'Inter', Arial, sans-serif`,
      fontSize: 1,
      padding: 2,
      '&:focus': {
        borderColor: colors.blue,
        outline: 'none',
        boxShadow: 'none',
      },
    },
    textareaError: {
      background: colors.background,
      border: `1px solid ${colors.error}`,
      borderRadius: 1,
      fontFamily: `'Inter', Arial, sans-serif`,
      fontSize: 1,
      padding: 2,
      '&:focus': {
        borderColor: colors.blue,
        outline: 'none',
        boxShadow: 'none',
      },
    },
  },
  maxContainerWidth,
  radii,
  regular,
  space,
  text: {
    heading: {
      fontFamily: '"Varela Round", Arial, sans-serif',
      fontSize: fontSizes[5],
      fontWeight: 'normal',
    },
    small: {
      fontFamily: '"Varela Round", Arial, sans-serif',
      fontSize: fontSizes[4],
      fontWeight: 'normal',
    },
  },
  typography,
  zIndex,
}

export default StyledComponentTheme
