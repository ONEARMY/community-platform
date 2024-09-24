import badge from '../../assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import avatar from '../../assets/images/themes/fixing-fashion/avatar_space_sm.svg'
import favicon from '../../assets/images/themes/fixing-fashion/favicon.ico'
import logo from '../../assets/images/themes/fixing-fashion/fixing-fashion-header.png'
import { StyledComponentTheme } from './styles'

import type { PlatformTheme } from '../types'

export const Theme: PlatformTheme = {
  id: 'fixing-fashion',
  siteName: 'Fixing Fashion',
  description:
    'A series of tools for the Fixing Fashion community to collaborate around the world. Connect, share and meet each other to reduce textile waste.',
  logo,
  favicon,
  badge,
  avatar,
  styles: StyledComponentTheme,
}
