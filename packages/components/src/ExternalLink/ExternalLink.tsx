// eslint-disable-next-line no-restricted-imports
import { Link } from 'theme-ui'
import type { LinkProps } from 'theme-ui'

/**
 * Provides a styled `a` tag. Opens in new tab with noopener and noreferrer rel attributes
 *
 * https://pointjupiter.com/what-noopener-noreferrer-nofollow-explained/
 */
export const ExternalLink = (props: LinkProps) => {
  return <Link {...props} target="_blank" rel="noopener noreferrer"></Link>
}
