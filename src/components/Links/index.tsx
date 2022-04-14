import { Link as RouterLink } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { Link as ThemeUiLink } from 'theme-ui'

export const Link = (props) => <ThemeUiLink {...props} as={RouterLink} />
export const StyledHashLink = (props) => (
  <ThemeUiLink {...props} as={HashLink} />
)
