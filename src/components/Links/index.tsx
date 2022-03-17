import { Link as RouterLink } from 'react-router-dom'
import { Link as ThemeUiLink } from 'theme-ui'

export const Link = props => <ThemeUiLink {...props} as={RouterLink} />
