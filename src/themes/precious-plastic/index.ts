import logo from 'src/assets/images/precious-plastic-logo-official.svg'
import badge from 'src/assets/images/themes/precious-plastic/badge-member.svg'
import { THEME_LIST } from '..'
import type { PlatformTheme } from '../types'
import styles from './styles'

const Theme: PlatformTheme = {
  id: THEME_LIST.PRECIOUS_PLASTIC,
  siteName: 'Precious Plastic',
  logo, badge,
  avatar: '',
  howtoHeading: `Learn & share how to recycle, build and work with plastic`,
  styles,
  academyResource: 'https://onearmy.github.io/academy/',
  externalLinks: [
    {
      url: 'https://bazar.preciousplastic.com/',
      label: 'Bazar'
    },
    {
      url: 'https://preciousplastic.com/',
      label: 'Global Site'
    },
  ]
}

export default Theme
