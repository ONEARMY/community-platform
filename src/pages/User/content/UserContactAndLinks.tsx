import { ProfileLink } from 'oa-components'
import { ExternalLinkLabel } from 'oa-shared'
import { Box } from 'theme-ui'

export const UserContactAndLinks = ({ links }) =>
  links.length ? (
    <Box>
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
