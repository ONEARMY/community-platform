import { ProfileLink } from '@onearmy.apps/components'
import { ExternalLinkLabel } from '@onearmy.apps/shared'
import { Box } from 'theme-ui'

export const UserContactAndLinks = ({ links }) =>
  links.length ? (
    <Box sx={{ mt: 6 }}>
      <span>Links</span>
      {links.map((link, i) => (
        <ProfileLink
          {...link}
          key={i}
          sx={{ mt: 2 }}
          icon={link.label
            .replace(ExternalLinkLabel.SOCIAL_MEDIA, 'social-media')
            .replace(ExternalLinkLabel.EMAIL, 'email-outline')}
        />
      ))}
    </Box>
  ) : null

export default UserContactAndLinks
