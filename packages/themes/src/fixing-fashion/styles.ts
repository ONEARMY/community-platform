import logo from '../../assets/images/themes/fixing-fashion/fixing-fashion-header.png'
import { baseTheme } from '../common'
import { getButtons } from '../common/button'

import type { ThemeWithName } from '../types'

export type { ButtonVariants } from '../common/button'
import memberBadgeHighDetail from '../../assets/images/themes/fixing-fashion/avatar_member_lg.svg' // use enum to specify list of possible colors for typing
import memberBadgeLowDetail from '../../assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import spaceBadge from '../../assets/images/themes/fixing-fashion/avatar_space_lg.svg'

export const colors = {
  ...baseTheme.colors,
  primary: 'green',
  accent: { base: '#F82F03', hover: 'hsl(14, 81%, 63%)' },
}

// cc - assume standard image widths are 4:3, however not clearly defined

export const StyledComponentTheme: ThemeWithName = {
  name: 'Fixing Fashion',
  logo: logo,
  ...baseTheme,
  colors,
  buttons: getButtons(colors),
  badges: {
    member: {
      lowDetail: memberBadgeLowDetail,
      normal: memberBadgeHighDetail,
    },
    space: {
      lowDetail: spaceBadge,
      normal: spaceBadge,
    },
  },
}
