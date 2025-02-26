import { Button, ReturnPathLink } from 'oa-components'
import { Alert, Flex, Text } from 'theme-ui'

interface Props {
  displayName: string
}

export const UserContactNotLoggedIn = ({ displayName }: Props) => {
  return (
    <Alert variant="info">
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Text sx={{ textAlign: 'left' }}>
          {`${displayName} would love to hear from you...but you're not logged in!`}
        </Text>
        <Text sx={{ textAlign: 'left' }}>
          If you were you'd able to send them a message...
        </Text>
        <Flex sx={{ alignItems: 'center', flexDirection: 'row', gap: 2 }}>
          <ReturnPathLink
            to="/sign-in"
            style={{
              textDecoration: 'underline',
              color: 'inherit',
            }}
          >
            Login
          </ReturnPathLink>
          <ReturnPathLink to="/sign-up">
            <Button type="button" icon="star">
              Sign-up now
            </Button>
          </ReturnPathLink>
        </Flex>
      </Flex>
    </Alert>
  )
}
