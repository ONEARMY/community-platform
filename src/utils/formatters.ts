import { ExternalLinkLabel } from 'oa-shared'

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
    ].includes(linkType as ExternalLinkLabel)
  ) {
    return ensureExternalUrl(link)
  }

  return link
}
