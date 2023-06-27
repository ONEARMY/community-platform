import CollectionBadge from '../../assets/images/badges/pt-collection-point.svg'
import CollectionBadgeLowDetail from '../../assets/icons/map-collection.svg'
import MachineBadge from '../../assets/images/badges/pt-machine-shop.svg'
import MachineBadgeLowDetail from '../../assets/icons/map-machine.svg'
import WorkspaceBadge from '../../assets/images/badges/pt-workspace.svg'
import WorkspaceBadgeLowDetail from '../../assets/icons/map-workspace.svg'
import LocalComBadge from '../../assets/images/badges/pt-local-community.svg'
import LocalComBadgeLowDetail from '../../assets/icons/map-community.svg'
import logo from '../../assets/images/precious-plastic-logo-official.svg'
import memberBadgeLowDetail from '../../assets/images/themes/precious-plastic/avatar_member_sm.svg'
import memberBadgeHighDetail from '../../assets/images/themes/precious-plastic/avatar_member_lg.svg'
import type { ThemeWithName } from '../types'
import { getButtons } from '../common/button'
import { baseTheme } from '../common'
export type { ButtonVariants } from '../common/button'

// use enum to specify list of possible colors for typing
export const colors = {
  ...baseTheme.colors,
  primary: 'red',
  accent: { base: '#fee77b', hover: '#ffde45' },
}

// cc - assume standard image widths are 4:3, however not clearly defined

export const styles: ThemeWithName = {
  name: 'Precious Plastic',
  logo: logo,
  profileGuidelinesURL:
    'https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view',
  communityProgramURL:
    'https://community.preciousplastic.com/academy/guides/community-program',
  ...baseTheme,
  badges: {
    member: {
      lowDetail: memberBadgeLowDetail,
      normal: memberBadgeHighDetail,
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
  buttons: getButtons(colors),
  colors,
}
