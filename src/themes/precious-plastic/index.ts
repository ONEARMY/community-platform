import logo from 'src/assets/images/precious-plastic-logo-official.svg'
import type { PlatformTheme } from '../types'
import styles from './styles'

const Theme: PlatformTheme = {
  siteName: 'Precious Plastic',
  logo,
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
