import { commonColors } from './../common/colors'
import { textVariants } from '../common/textVariants'
import memberBadgeLowDetail from '../../assets/images/themes/precious-plastic/avatar_member_sm.svg'
import memberBadgeHighDetail from '../../assets/images/themes/precious-plastic/avatar_member_lg.svg'
import CollectionBadge from '../../assets/images/badges/pt-collection-point.svg'
import CollectionBadgeLowDetail from '../../assets/icons/map-collection.svg'
import MachineBadge from '../../assets/images/badges/pt-machine-shop.svg'
import MachineBadgeLowDetail from '../../assets/icons/map-machine.svg'
import WorkspaceBadge from '../../assets/images/badges/pt-workspace.svg'
import WorkspaceBadgeLowDetail from '../../assets/icons/map-workspace.svg'
import LocalComBadge from '../../assets/images/badges/pt-local-community.svg'
import LocalComBadgeLowDetail from '../../assets/icons/map-community.svg'
import logo from '../../assets/images/precious-plastic-logo-official.svg'

import type { ThemeWithName } from '../types'
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
  primary: 'red',
  accent: { base: '#fee77b', hover: '#ffde45' },
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
  info: {
    borderRadius: 1,
    paddingX: 3,
    paddingY: 3,
    backgroundColor: colors.accent.base,
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'normal',
  },
  ...commonAlerts,
}

export const styles: ThemeWithName = {
  name: 'Precious Plastic',
  logo: logo,
  profileGuidelinesURL:
    'https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view',
  communityProgramURL:
    'https://community.preciousplastic.com/academy/guides/community-program',
  alerts,
  badges: {
    ...commonBadges,
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
  buttons: getButtons(colors),
  cards: {
    ...commonCards,
  },
  colors,
  fonts,
  fontSizes,
  sizes: {
    container: maxContainerWidth,
  },
  forms: {
    ...commonForms,
  },
  maxContainerWidth,
  radii,
  regular,
  space,
  text: textVariants,
  zIndex,
}
