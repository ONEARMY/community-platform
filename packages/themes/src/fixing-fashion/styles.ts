import { commonColors } from './../common/colors'
import { textVariants } from '../common/textVariants'
import type { ThemeWithName } from '../types'
import spaceBadge from '../../assets/images/themes/fixing-fashion/avatar_space_lg.svg'
import memberBadgeLowDetail from '../../assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import memberBadgeHighDetail from '../../assets/images/themes/fixing-fashion/avatar_member_lg.svg'
import logo from '../../assets/images/themes/fixing-fashion/fixing-fashion-header.png'
import { getButtons } from '../common/button'
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

const fonts = {
  ...commonFontFamily,
}

// use enum to specify list of possible colors for typing
export const colors = {
  ...commonColors,
  primary: 'green',
  accent: { base: '#E95628', hover: 'hsl(14, 81%, 43%)' },
}

export const zIndex = {
  ...commonZIndex,
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
  name: 'Fixing Fashion',
  logo: logo,
  profileGuidelinesURL:
    'https://community.fixing.fashion/academy/guides/profile',
  communityProgramURL:
    'https://community.fixing.fashion/academy/guides/community-program',
  alerts,
  badges: {
    ...commonBadges,
    space: {
      lowDetail: spaceBadge,
      normal: spaceBadge,
    },
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
  sizes: {
    container: maxContainerWidth,
  },
  text: textVariants,
  zIndex,
}
