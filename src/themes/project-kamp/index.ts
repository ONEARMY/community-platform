import type { PlatformTheme } from '../types'
import logo from 'src/assets/images/themes/project-kamp/project-kamp-header.png'
import styles from './styles'

const Theme: PlatformTheme = {
  siteName: 'Project Kamp',
  logo,
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