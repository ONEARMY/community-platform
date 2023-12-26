import React from 'react'
import { Box } from 'theme-ui'
import { ExternalLink as Link } from 'oa-components'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'

interface IProps {
  content: string
  href: string
}

const MenuMobileExternalLink = observer(({ content, href }: IProps) => {
  const { mobileMenuStore } = useCommonStores().stores
  const id = content.toLowerCase().replace(' ', '-')

  return (
    <>
      <Box data-cy="mobile-menu-item" sx={{ paddingTop: 3, paddingBottom: 3 }}>
        <Link
          onClick={() => mobileMenuStore.toggleMobilePanel()}
          id={id}
          href={href}
          sx={{ color: 'silver', fontSize: 2 }}
        >
          {content}
        </Link>
      </Box>
    </>
  )
})

export default MenuMobileExternalLink
