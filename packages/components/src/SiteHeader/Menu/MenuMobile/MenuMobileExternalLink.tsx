import { Box } from 'theme-ui'
import { ExternalLink as Link } from 'oa-components'

export const MenuMobileExternalLink = (props: {
  content: string
  href: string
}) => {
  const { content, href } = props
  const id = content.toLowerCase().replace(' ', '-')
  return (
    <>
      <Box data-cy="mobile-menu-item" sx={{ paddingTop: 3, paddingBottom: 3 }}>
        <Link
          onClick={() => {
            console.log(`TODO: menu.toggleMobilePanel()`)
          }}
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
