import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'

// TODO : create a component to avoid duplicate with how-to's guidelines

export const PostingGuidelines = () => (
  <Flex card mediumRadius sx={{ flexDirection: 'column' }} bg="white" p={4}>
    <Heading medium bold mb={2}>
      Event Posting Guidelines
    </Heading>
    <Text auxiliary mb={1}>
      1. Use a platform like Facebook, Eventbrite, Meetup, etc.
    </Text>
    <Text auxiliary mb={1}>
      2. Copy and paste the url.
    </Text>
    <Text auxiliary mb={1}>
      3. Add additional information.
    </Text>
    <Text auxiliary mb={1}>
      4. Reach an army of likeminded people :)
    </Text>
  </Flex>
)
