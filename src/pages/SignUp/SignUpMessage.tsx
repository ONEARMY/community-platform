import { HeroBanner } from 'oa-components'
import { Card, Flex, Heading, Text } from 'theme-ui'

const SignUpMessagePage = ({ email }) => (
  <Flex
    sx={{
      bg: 'inherit',
      px: 2,
      width: '100%',
      maxWidth: '620px',
      mx: 'auto',
      mt: [5, 10],
      mb: 3,
    }}
  >
    <Flex sx={{ flexDirection: 'column', width: '100%' }}>
      <HeroBanner type="email" />
      <Card sx={{ borderRadius: 3 }}>
        <Flex sx={{ padding: 4, gap: 4, flexDirection: 'column' }}>
          <Flex sx={{ gap: 2, flexDirection: 'column' }}>
            <Heading>Yay! You signed up!</Heading>
            <Heading variant="small">...Now please verify your account</Heading>
          </Flex>
          <Text sx={{ color: 'grey' }}>
            <p>
              We've sent a link to <strong>{email}</strong>. Please click it to
              confirm your account.
            </p>
            <p>After you've done that, you can login.</p>
          </Text>
        </Flex>
      </Card>
      <Flex sx={{ mt: 3, justifyContent: 'flex-start' }}></Flex>
    </Flex>
  </Flex>
)

export default SignUpMessagePage
