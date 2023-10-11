import { Flex, Box, Text } from 'theme-ui'
import { Button } from '../Button/Button'
import { InternalLink } from '../InternalLink/InternalLink'

export interface BlockedRouteProps {
  children: React.ReactNode
  redirectUrl?: string
  redirectLabel?: string
}

export const BlockedRoute = (props: BlockedRouteProps) => {
  const redirectLabel = props.redirectLabel || 'Back to home'
  const redirectUrl = props.redirectUrl || '/'
  return (
    <Flex
      sx={{ justifyContent: 'center', flexDirection: 'column', mt: 8 }}
      data-cy="BlockedRoute"
    >
      <Text sx={{ width: '100%', textAlign: 'center' }}>{props.children}</Text>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <InternalLink to={redirectUrl}>
          <Button variant={'subtle'} small>
            {redirectLabel}
          </Button>
        </InternalLink>
      </Box>
    </Flex>
  )
}
