import type { PlatformTheme } from '../types'
import logo from '../../assets/images/themes/fixing-fashion/fixing-fashion-header.png'
import badge from '../../assets/images/themes/fixing-fashion/avatar_member_sm.svg'
import avatar from '../../assets/images/themes/fixing-fashion/avatar_space_sm.svg'
import { StyledComponentTheme } from './styles'

export const Theme: PlatformTheme = {
  id: 'fixing-fashion',
  siteName: 'Fixing Fashion',
  logo,
  badge,
  avatar,
  howtoHeading: `Learn & share how to recycle, build and work`,
  styles: StyledComponentTheme,
  academyResource: 'https://fixing-fashion-academy.netlify.app/',
  externalLinks: [
    {
      url: 'https://fixing.fashion/',
      label: 'Project Homepage',
    },
  ],
}
