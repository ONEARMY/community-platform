import React from 'react'
import { Card, Flex, Heading, Text } from 'theme-ui'
import { Button } from 'oa-components'
import { Link } from 'react-router-dom'

class ForgotPasswordMessagePage extends React.Component {
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
          <Card bg={'softblue'}>
            <Flex px={3} py={2} sx={{ width: '100%' }}>
              <Heading>Sent</Heading>
            </Flex>
          </Card>
          <Card mt={3}>
            <Flex
              px={4}
              pt={0}
              pb={4}
              sx={{ flexWrap: 'wrap', flexDirection: 'column', width: '100%' }}
            >
              <Heading variant="small" py={4} sx={{ width: '100%' }}>
                Check your email
              </Heading>
              <Flex sx={{ flexDirection: 'column' }} mb={3}>
                <Flex sx={{ flexDirection: 'column' }}>
                  <Text>
                    We sent you an email with all the details to reset your
                    password. Psss.. Try a password manager tool :)
                  </Text>
                  <Text color={'grey'} mt={2} sx={{ fontSize: 1 }}>
                    Didn't receive the email? <Link to="#">Resend</Link>.
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          <Flex mt={3} sx={{ justifyContent: 'flex-end' }}>
            <Button variant={'outline'}>Close</Button>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
export default ForgotPasswordMessagePage
