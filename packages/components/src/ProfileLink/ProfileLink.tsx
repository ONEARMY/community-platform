import { Box, Flex } from 'theme-ui'
import type { ThemeUICSSObject } from 'theme-ui'
import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Icon } from '../Icon/Icon'
import type { IGlyphs } from '../Icon/types'

export interface Props {
  url: string
  label: string
  icon: keyof IGlyphs
  sx?: ThemeUICSSObject
}

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Ensure urls are complete (start http/https://) and replace emails with mailto
 */
const rewriteUrl = (url: string, label: string) => {
  switch (label) {
    case 'email':
      return `mailto:${url}`
    default:
      return url.indexOf('http') === 0 ? url : `http://${url}`
  }
}

const socialMediaNetworks = [
  { pattern: new RegExp(/twitter\.com/), label: 'Twitter' },
  { pattern: new RegExp(/facebook\.com/), label: 'Facebook' },
  { pattern: new RegExp(/youtube\.com/), label: 'Youtube' },
  { pattern: new RegExp(/instagram\.com/), label: 'Instagram' },
]

const getLabelText = (label: string, url: string) => {
  const matchedNetwork = socialMediaNetworks.find((network) =>
    network.pattern.test(url),
  )

  if (matchedNetwork) {
    return matchedNetwork.label
  }

  return label && capitalizeFirstLetter(label)
}

export const ProfileLink = (props: Props) => {
  const { url, label } = props
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
        <Icon glyph={props.icon} size={22} />
      </Box>
      <ExternalLink ml={2} color={'black'} href={rewriteUrl(url, label)}>
        {getLabelText(label, url)}
      </ExternalLink>
    </Flex>
  )
}
