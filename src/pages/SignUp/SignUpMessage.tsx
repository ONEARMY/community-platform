import { Link } from 'react-router-dom'
import { Button, HeroBanner } from 'oa-components'
import { Card, Flex, Heading, Text } from 'theme-ui'

const SignUpMessagePage = () => (
  <Flex
    bg="inherit"
    px={2}
    sx={{ width: '100%' }}
    css={{ maxWidth: '620px' }}
    mx={'auto'}
    mt={[5, 10]}
    mb={3}
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
            We've sent you an email. Please find a confirmation link in your
            mailbox.
          </Text>
          <Link to={'/settings'}>
            <Button variant="primary" data-cy="home" sx={{ borderRadius: 3 }}>
              Complete your profile
            </Button>
          </Link>
        </Flex>
      </Card>
      <Flex mt={3} sx={{ justifyContent: 'flex-start' }}></Flex>
    </Flex>
  </Flex>
)

export default SignUpMessagePage
