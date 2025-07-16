import { Box, Flex } from 'theme-ui'

import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Icon } from '../Icon/Icon'

import type { ThemeUICSSObject } from 'theme-ui'

export interface Props {
  url: string
  sx?: ThemeUICSSObject
}

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Ensure urls are complete (start http/https://) and replace emails with mailto
 */
const rewriteUrl = (url: string) => {
  return url.indexOf('http') === 0 ? url : `http://${url}`
}

export const ProfileLink = (props: Props) => {
  return (
    <Flex
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        mt: 0,
        ...props.sx,
      }}
    >
      <Box>
        <Icon glyph="website" size={22} />
      </Box>
      <ExternalLink
        marginLeft={2}
        color="black"
        data-cy="profile-link"
        href={rewriteUrl(props.url)}
      />
    </Flex>
  )
}
