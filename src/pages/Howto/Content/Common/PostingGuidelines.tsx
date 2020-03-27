import * as React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Link } from 'rebass'
import theme from 'src/themes/styled.theme'

export const PostingGuidelines = () => (
  <Flex card mediumRadius flexDirection={'column'} bg="white" p={4}>
    <Heading medium bold mb={2}>
      How-to Guidelines
    </Heading>
    <Text auxiliary mb={1}>
      How does it work?
    </Text>
    <Text auxiliary mb={1}>
      1. Choose what you want to share 🙌
    </Text>
    <Text auxiliary mb={1}>
      2. Read{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="/academy/create/howto"
      >
        our guidelines!
      </Link>
    </Text>
    <Text auxiliary mb={1}>
      3. Prepare your text & images.
    </Text>
    <Text auxiliary mb={1}>
      4. Create your How-to.
    </Text>
    <Text auxiliary mb={1}>
      5. Click on “Publish”.
    </Text>
    <Text auxiliary mb={1}>
      6. We will either send you feedback, or
    </Text>
    <Text auxiliary mb={1}>
      7. Approve if everything is okay :)
    </Text>
    <Text auxiliary mb={1}>
      8. Be proud :)
    </Text>
  </Flex>
)
