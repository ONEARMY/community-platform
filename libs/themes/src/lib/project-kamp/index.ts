import badge from '../assets/images/themes/project-kamp/avatar_member_sm.svg'
import avatar from '../assets/images/themes/project-kamp/avatar_space_sm.svg'
import logo from '../assets/images/themes/project-kamp/project-kamp-header.png'
import { StyledComponentTheme } from './styles'

import type { PlatformTheme } from '../types'

export const Theme: PlatformTheme = {
  id: 'project-kamp',
  siteName: 'Project Kamp',
  logo,
  badge,
  avatar,
  howtoHeading: `Learn & share how to recycle, build and work`,
  styles: StyledComponentTheme,
  academyResource: 'https://project-kamp-academy.netlify.app/',
  externalLinks: [
    {
      url: 'https://projectkamp.com/support.html',
      label: 'Support Us',
    },
    {
      url: 'https://projectkamp.com/',
      label: 'Project Homepage',
    },
  ],
}
