import type { PlatformTheme } from '../types'
import logo from 'src/assets/images/themes/fixing-fashion/fixing-fashion-header.png'
import badge from 'src/assets/images/themes/fixing-fashion/badge.svg'
import avatar from 'src/assets/images/themes/fixing-fashion/avatar.svg'
import styles from './styles'
import { THEME_LIST } from '..'

const Theme: PlatformTheme = {
  id: THEME_LIST.FIXING_FASHION,
  siteName: 'Fixing Fashion',
  logo,
  badge,
  avatar,
  howtoHeading: `Learn & share how to recycle, build and work`,
  styles,
  academyResource: 'https://project-kamp-academy.netlify.app/',
  externalLinks: [
    {
      url: 'https://fixing.fashion/',
      label: 'Project Homepage',
    },
  ],
}

export default Theme
