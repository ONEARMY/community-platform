import memberBadgeHighDetail from '../../assets/images/themes/project-kamp/avatar_member_lg.svg'
import memberBadgeLowDetail from '../../assets/images/themes/project-kamp/avatar_member_sm.svg'
import logo from '../../assets/images/themes/project-kamp/project-kamp-header.png'
import { baseTheme } from '../common'
import { getButtons } from '../common/button'

import type { ThemeWithName } from '../types'

export type { ButtonVariants } from '../common/button'

// use enum to specify list of possible colors for typing
export const colors = {
  ...baseTheme.colors,
  primary: 'green',
  accent: { base: '#8ab57f', hover: 'hsl(108, 25%, 68%)' },
}

export const alerts = {
  ...baseTheme.alerts,
  accent: {
    ...baseTheme.alerts.failure,
    backgroundColor: colors.accent.base,
  },
}

export const StyledComponentTheme: ThemeWithName = {
  name: 'Project Kamp',
  profileGuidelinesURL:
    'https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view',
  communityProgramURL:
    'https://community.preciousplastic.com/academy/guides/community-program',
  logo: logo,
  ...baseTheme,
  alerts,
  colors,
  buttons: getButtons(colors),
  badges: {
    member: {
      lowDetail: memberBadgeLowDetail,
      normal: memberBadgeHighDetail,
    },
  },
}
