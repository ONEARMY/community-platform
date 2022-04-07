import React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { Button } from 'oa-components'
import Text from 'src/components/Text'
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
          <Flex
            card
            mediumRadius
            bg={'softblue'}
            px={3}
            py={2}
            sx={{ width: '100%' }}
          >
            <Heading medium sx={{ width: '100%' }}>
              Sent
            </Heading>
          </Flex>
          <Flex
            card
            mediumRadius
            bg={'white'}
            mt={3}
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
                <Text small color={'grey'} mt={2}>
                  Didn't receive the email? <Link to="#">Resend</Link>.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex mt={3} sx={{ justifyContent: 'flex-end' }}>
            <Button variant="tertiary">Close</Button>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
export default ForgotPasswordMessagePage
