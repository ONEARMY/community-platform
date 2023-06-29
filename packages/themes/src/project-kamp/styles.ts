import logo from '../../assets/images/themes/project-kamp/project-kamp-header.png'
import type { ThemeWithName } from '../types'
import { getButtons } from '../common/button'
import { baseTheme } from '../common'
import memberBadgeLowDetail from '../../assets/images/themes/project-kamp/avatar_member_sm.svg'
import memberBadgeHighDetail from '../../assets/images/themes/project-kamp/avatar_member_lg.svg'
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
  profileGuidelinesURL:
    'https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view',
  communityProgramURL:
    'https://community.preciousplastic.com/academy/guides/community-program',
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
