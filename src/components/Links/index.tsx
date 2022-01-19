import { Link as RouterLink } from 'react-router-dom'
import { Link as RebassLink } from 'rebass/styled-components'

export const Link = props => <RebassLink {...props} as={RouterLink} />
