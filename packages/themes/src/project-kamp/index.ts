import badge from '../../assets/images/themes/project-kamp/avatar_member_sm.svg'
import avatar from '../../assets/images/themes/project-kamp/avatar_space_sm.svg'
import logo from '../../assets/images/themes/project-kamp/project-kamp-header.png'
import { StyledComponentTheme } from './styles'

import type { PlatformTheme } from '../types'

export const Theme: PlatformTheme = {
  id: 'project-kamp',
  siteName: 'Project Kamp',
  logo,
  badge,
  avatar,
  styles: StyledComponentTheme,
}
