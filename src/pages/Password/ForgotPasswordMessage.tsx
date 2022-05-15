import React from 'react'
import { Card, Flex } from 'theme-ui'
import Heading from 'src/components/Heading'
import { Button } from 'oa-components'
import { Text } from 'theme-ui'
import { Link } from 'src/components/Links'

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
              <Heading medium sx={{ width: '100%' }}>
                Sent
              </Heading>
            </Flex>
          </Card>
          <Card mt={3}>
            <Flex
              px={4}
              pt={0}
              pb={4}
              sx={{ flexWrap: 'wrap', flexDirection: 'column', width: '100%' }}
            >
              <Heading small py={4} sx={{ width: '100%' }}>
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
            <Button variant="tertiary">Close</Button>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
export default ForgotPasswordMessagePage
