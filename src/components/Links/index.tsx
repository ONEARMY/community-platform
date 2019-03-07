import * as React from 'react'
import RouterLink from 'react-router-dom/Link'
import { Link as RebassLink } from 'rebass'

export const Link = props => <RebassLink {...props} as={RouterLink} />
