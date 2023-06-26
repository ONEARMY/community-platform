import { textVariants } from '../common/textVariants'
import memberBadgeLowDetail from '../../assets/images/themes/project-kamp/avatar_member_sm.svg'
import memberBadgeHighDetail from '../../assets/images/themes/project-kamp/avatar_member_lg.svg'
import logo from '../../assets/images/themes/project-kamp/project-kamp-header.png'
import type { ThemeWithName } from '../types'
import { getButtons } from '../common/button'
import { commonColors } from '../common/colors'
import { commonZIndex } from '../common/zIndex'
import { commonFontFamily } from '../common/fontFamily'
import { commonSpace } from '../common/space'
import { commonFontSize } from '../common/fontSize'
import { commonBreakPoints } from '../common/breakpoints'
import { commonMaxContainerWidth } from '../common/maxContainerWidth'
import { commonFontWeight } from '../common/fontWeight'
import { commonAlerts } from '../common/alerts'
import { commonBadges } from '../common/badges'
import { commonCards } from '../common/cards'
import { commonForms } from '../common/forms'
export type { ButtonVariants } from '../common/button'

// use enum to specify list of possible colors for typing
export const colors = {
  ...commonColors,
  primary: 'green',
  accent: { base: '#8ab57f', hover: 'hsl(108, 25%, 68%)' },
}

export const zIndex = {
  ...commonZIndex,
}

const fonts = {
  ...commonFontFamily,
}

const space = [...commonSpace]
const radii = space
const fontSizes = [...commonFontSize]
const breakpoints = [...commonBreakPoints]
const maxContainerWidth = commonMaxContainerWidth
const regular = commonFontWeight.regular
const bold = commonFontWeight.bold
// cc - assume standard image widths are 4:3, however not clearly defined

const alerts = {
  ...commonAlerts,
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
    ...commonBadges,
  },
  cards: {
    ...commonCards,
  },
  colors,
  buttons: getButtons(colors),
  breakpoints,
  space,
  radii,
  fontSizes,
  fonts,
  forms: {
    ...commonForms,
  },
  maxContainerWidth,
  regular,
  bold,
  text: textVariants,
  zIndex,
  sizes: {
    container: maxContainerWidth,
  },
}
