import logo from '../assets/images/precious-plastic-logo-official.svg'
import badge from '../assets/images/themes/precious-plastic/avatar_member_sm.svg'
import donationBanner from '../assets/images/themes/precious-plastic/donation-banner.jpg'
import { styles } from './styles'

import type { PlatformTheme } from '../types'

export const Theme: PlatformTheme = {
  id: 'precious-plastic',
  siteName: 'Precious Plastic',
  logo,
  badge,
  donations: {
    body: 'All of the content here is free. Your donation supports this library of Open Source recycling knowledge. Making it possible for everyone in the world to use it and start recycling.',
    iframeSrc: 'https://donorbox.org/embed/ppcpdonor?language=en',
    imageURL: donationBanner,
  },
  avatar: '',
  howtoHeading: `Learn & share how to recycle, build and work with plastic`,
  styles,
  academyResource: 'https://onearmy.github.io/academy/',
  externalLinks: [
    {
      url: 'https://bazar.preciousplastic.com/',
      label: 'bazar',
    },
    {
      url: 'https://preciousplastic.com/',
      label: 'Global Site',
    },
  ],
}
