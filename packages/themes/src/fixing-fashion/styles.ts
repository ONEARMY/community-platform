import type { ThemeWithName } from '../types'
import logo from '../../assets/images/themes/fixing-fashion/fixing-fashion-header.png'
import { getButtons } from '../common/button'
import { baseTheme } from '../common'
export type { ButtonVariants } from '../common/button'
import memberBadgeLowDetail from '../../assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import memberBadgeHighDetail from '../../assets/images/themes/fixing-fashion/avatar_member_lg.svg' // use enum to specify list of possible colors for typing
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
  profileGuidelinesURL:
    'https://community.fixing.fashion/academy/guides/profile',
  communityProgramURL:
    'https://community.fixing.fashion/academy/guides/community-program',

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
