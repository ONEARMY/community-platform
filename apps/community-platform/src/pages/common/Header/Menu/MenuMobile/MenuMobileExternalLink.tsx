import React from 'react'
import { ExternalLink as Link } from '@onearmy.apps/components'
import { Box } from 'theme-ui'

import { MobileMenuContext } from '../../MobileMenuContext'

interface IProps {
  content: string
  href: string
}

const MenuMobileExternalLink = ({ content, href }: IProps) => {
  const mobileMenuContext = React.useContext(MobileMenuContext)
  const id = content.toLowerCase().replace(' ', '-')

  return (
    <>
      <Box data-cy="mobile-menu-item" sx={{ paddingTop: 3, paddingBottom: 3 }}>
        <Link
          onClick={() => mobileMenuContext.setIsVisible(false)}
          id={id}
          href={href}
          sx={{ color: 'silver', fontSize: 2 }}
        >
          {content}
        </Link>
      </Box>
    </>
  )
}

export default MenuMobileExternalLink
