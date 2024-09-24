import badge from '../../assets/images/themes/project-kamp/avatar_member_sm.svg'
import avatar from '../../assets/images/themes/project-kamp/avatar_space_sm.svg'
import favicon from '../../assets/images/themes/project-kamp/favicon.ico'
import logo from '../../assets/images/themes/project-kamp/project-kamp-header.png'
import { StyledComponentTheme } from './styles'

import type { PlatformTheme } from '../types'

export const Theme: PlatformTheme = {
  id: 'project-kamp',
  siteName: 'Project Kamp',
  description: '',
  logo,
  favicon,
  badge,
  avatar,
  styles: StyledComponentTheme,
}
