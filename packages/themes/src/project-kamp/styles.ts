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

// cc - assume standard image widths are 4:3, however not clearly defined

export const StyledComponentTheme: ThemeWithName = {
  name: 'Project Kamp',
  logo: logo,
  ...baseTheme,
  colors,
  buttons: getButtons(colors),
  badges: {
    member: {
      lowDetail: memberBadgeLowDetail,
      normal: memberBadgeHighDetail,
    },
  },
}
