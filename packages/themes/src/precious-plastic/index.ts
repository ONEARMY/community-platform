import { ExternalLinkLabel } from 'oa-shared'

import logo from '../../assets/images/precious-plastic-logo-official.svg'
import badge from '../../assets/images/themes/precious-plastic/avatar_member_sm.svg'
import { styles } from './styles'

import type { PlatformTheme } from '../types'

export const Theme: PlatformTheme = {
  id: 'precious-plastic',
  siteName: 'Precious Plastic',
  logo,
  badge,
  avatar: '',
  howtoHeading: `Learn & share how to recycle, build and work with plastic`,
  styles,
  academyResource: 'https://onearmy.github.io/academy/',
  externalLinks: [
    {
      url: 'https://bazar.preciousplastic.com/',
      label: ExternalLinkLabel.BAZAR,
    },
    {
      url: 'https://preciousplastic.com/',
      label: 'Global Site',
    },
  ],
}
