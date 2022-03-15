import React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import theme from 'src/themes/styled.theme'
import { Button } from 'oa-components'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import { Link as ExternalLink } from 'rebass'

class SignUpMessagePage extends React.Component {
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
          <Flex card mediumRadius bg={theme.colors.softblue} px={3} py={2}>
            <Heading medium>Sent</Heading>
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
              Sign up successful
            </Heading>
            <Flex flexDirection={'column'} mb={3}>
              <Text>
                We sent you an email with all the details to complete your
                profile.
              </Text>
              <Text small color={'grey'} mt={2}>
                Didn't receive the email?{' '}
                <ExternalLink
                  color={theme.colors.grey}
                  sx={{ textDecoration: 'underline' }}
                  href="mailto:hello@onearmy.earth?subject=Email%20confirmation%20failed%20community-platform"
                >
                  Let us know
                </ExternalLink>
                .
              </Text>
            </Flex>
          </Flex>
          <Flex mt={3} justifyContent={'flex-end'}>
            <Link to={'/'}>
              <Button variant="secondary" data-cy="home">
                Home
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
export default SignUpMessagePage
