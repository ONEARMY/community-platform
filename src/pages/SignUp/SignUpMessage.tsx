import * as React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'

const Label = styled.label`
 font-size: ${theme.fontSizes[2] + 'px'}
 margin-bottom: ${theme.space[2] + 'px'}
 display: block;
`

export class SignUpMessagePage extends React.Component {
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
              Sign up successful
            </Heading>
            <Flex flexDirection={'column'} mb={3}>
              <Text>
                We sent you an email with all the details to complete your
                profile.
              </Text>
              <Text small color={'grey'} mt={2}>
                Didn't receive the email? <Link to="#">Resend</Link>.
              </Text>
            </Flex>
          </Flex>
          <Flex mt={3} justifyContent={'flex-end'}>
            <Link to={'/'}>
              <Button variant="secondary" small data-cy="home">
                Home
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
