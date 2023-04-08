import React from 'react'
import { Card, Flex, Heading, Text } from 'theme-ui'
import { Button, ExternalLink } from 'oa-components'
import { Link } from 'react-router-dom'

class SignUpMessagePage extends React.Component {
  public render() {
    return (
      <Flex
        bg="inherit"
        px={2}
        sx={{ width: '100%' }}
        css={{ maxWidth: '620px' }}
        mx={'auto'}
        mt={20}
        mb={3}
      >
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Card sx={{ backgroundColor: 'softblue', px: 3, py: 2 }}>
            <Heading>Sent</Heading>
          </Card>
          <Card mt={3}>
            <Flex
              px={4}
              pt={0}
              pb={4}
              sx={{ flexWrap: 'wrap', width: '100%', flexDirection: 'column' }}
            >
              <Heading variant="small" py={4} sx={{ width: '100%' }}>
                Sign up successful
              </Heading>
              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                <Text>
                  We sent you an email with all the details to complete your
                  profile.
                </Text>
                <Text color={'grey'} mt={2} sx={{ fontSize: 1 }}>
                  Didn't receive the email?{' '}
                  <ExternalLink
                    sx={{ textDecoration: 'underline', color: 'grey' }}
                    href="mailto:hello@onearmy.earth?subject=Email%20confirmation%20failed%20community-platform"
                  >
                    Let us know
                  </ExternalLink>
                  .
                </Text>
              </Flex>
            </Flex>
          </Card>
          <Flex mt={3} sx={{ justifyContent: 'flex-start' }}>
            <Link to={'/settings'}>
              <Button variant="primary" data-cy="home">
                Complete your profile
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
export default SignUpMessagePage
