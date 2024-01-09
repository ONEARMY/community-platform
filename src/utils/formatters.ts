import { ExternalLinkLabel } from 'src/models'

import { ensureExternalUrl } from './validators'

// TODO - we might want to add more formatting for cases where,
// e.g. only a username is given for a bazar link
export const formatLink = (
  unformattedLinkString: string,
  linkType?: string,
) => {
  const link = unformattedLinkString

  if (
    [
      ExternalLinkLabel.FORUM,
      ExternalLinkLabel.WEBSITE,
      ExternalLinkLabel.SOCIAL_MEDIA,
      ExternalLinkLabel.BAZAR,
    ].includes(linkType)
  ) {
    return ensureExternalUrl(link)
  }

  return link
}
