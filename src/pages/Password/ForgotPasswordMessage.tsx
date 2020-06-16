import React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'

class ForgotPasswordMessagePage extends React.Component {
  public render() {
    return (
      <Flex
        bg="inherit"
        px={2}
        width={1}
        css={{ maxWidth: '620px' }}
        mx={'auto'}
        mt={20}
        mb={3}
      >
        <Flex flexDirection={'column'} width={1}>
          <Flex card mediumRadius bg={'softblue'} px={3} py={2} width={1}>
            <Heading medium width={1}>
              Sent
            </Heading>
          </Flex>
          <Flex
            card
            mediumRadius
            bg={'white'}
            width={1}
            mt={3}
            px={4}
            pt={0}
            pb={4}
            flexWrap="wrap"
            flexDirection="column"
          >
            <Heading small py={4} width={1}>
              Check your email
            </Heading>
            <Flex flexDirection={'column'} mb={3}>
              <Flex flexDirection={'column'}>
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
          <Flex mt={3} justifyContent={'flex-end'}>
            <Button variant="tertiary">Close</Button>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
export default ForgotPasswordMessagePage
