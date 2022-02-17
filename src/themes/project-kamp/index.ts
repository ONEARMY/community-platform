import type { PlatformTheme } from '../types'
import logo from 'src/assets/images/themes/project-kamp/project-kamp-header.png'
import badge from 'src/assets/images/themes/project-kamp/badge.svg'
import avatar from 'src/assets/images/themes/project-kamp/avatar.svg'
import styles from './styles'
import { THEME_LIST } from '..'

const Theme: PlatformTheme = {
  id: THEME_LIST.PROJECT_KAMP,
  siteName: 'Project Kamp',
  logo, badge, avatar,
  howtoHeading: `Learn & share how to recycle, build and work`,
  styles,
  academyResource: 'https://project-kamp-academy.netlify.app/',
  externalLinks: [
    {
      url: 'https://projectkamp.com/support.html',
      label: 'Support Us'
    },
    {
      url: 'https://projectkamp.com/',
      label: 'Project Homepage'
    }
  ]
}


export default Theme