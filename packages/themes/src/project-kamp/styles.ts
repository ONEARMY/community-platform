import { textVariants } from '../common/textVariants'
import memberBadgeLowDetail from '../../assets/images/themes/project-kamp/avatar_member_sm.svg'
import memberBadgeHighDetail from '../../assets/images/themes/project-kamp/avatar_member_lg.svg'
import logo from '../../assets/images/themes/project-kamp/project-kamp-header.png'
import type { ThemeWithName } from '../types'
import { getButtons } from '../common/button'
import { commonColors } from '../common/colors'
export type { ButtonVariants } from '../common/button'

// use enum to specify list of possible colors for typing
export const colors = {
  ...commonColors,
  primary: 'green',
  yellow: { base: '#8ab57f', hover: 'hsl(108, 25%, 68%)' },
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

const fonts = {
  body: `'Inter', Arial, sans-serif`,
}

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
    paddingX: 3,
    paddingY: 3,
    backgroundColor: colors.green,
    textAlign: 'center',
    fontWeight: 'normal',
  },
  failure: {
    borderRadius: 1,
    paddingX: 3,
    paddingY: 3,
    backgroundColor: colors.red2,
    textAlign: 'center',
    fontWeight: 'normal',
  },
}

export const StyledComponentTheme: ThemeWithName = {
  name: 'Project Kamp',
  profileGuidelinesURL:
    'https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view',
  communityProgramURL:
    'https://community.preciousplastic.com/academy/guides/community-program',
  logo: logo,
  alerts,
  badges: {
    member: {
      lowDetail: memberBadgeLowDetail,
      normal: memberBadgeHighDetail,
    },
  },
  cards: {
    primary: {
      background: 'white',
      border: `2px solid ${colors.black}`,
      borderRadius: 1,
      overflow: 'hidden',
    },
  },
  colors,
  buttons: getButtons(colors),
  breakpoints,
  space,
  radii,
  fontSizes,
  fonts,
  forms: {
    input: {
      background: colors.background,
      borderRadius: 1,
      border: '1px solid transparent',
      fontFamily: `'Inter', Arial, sans-serif`,
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
  regular,
  bold,
  text: textVariants,
  zIndex,
}
