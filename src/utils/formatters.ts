import { ensureExternalUrl } from './validators'

// TODO - we might want to add more formatting for cases where,
// e.g. only a username is given for a bazar link
export function formatLink(unformattedLinkString: string, linkType?: string) {
  const link = unformattedLinkString

  if (['forum', 'website', 'social media', 'bazar'].includes(linkType || '')) {
    return ensureExternalUrl(link)
  }

  return link
}
