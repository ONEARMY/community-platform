import { Link } from 'rebass'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import theme from 'src/themes/styled.theme'

export const PostingGuidelines = () => (
  <Flex card mediumRadius flexDirection={'column'} bg="white" p={4}>
    <Heading medium bold mb={2}>
      How does it work?
    </Heading>
    <Text auxiliary mb={1}>
      1. Choose a topic you want to research{' '}
      <span role="img" aria-label="raised-hand">
        🙌
      </span>
    </Text>
    <Text auxiliary mb={1}>
      2. Read{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="/academy/guides/research"
      >
        our guidelines{' '}
        <span role="img" aria-label="nerd-face">
          🤓
        </span>
      </Link>
    </Text>
    <Text auxiliary mb={1}>
      3. Write your introduction{' '}
      <span role="img" aria-label="archive-box">
        🗄️
      </span>
    </Text>
    <Text auxiliary mb={1}>
      4. Come back when you made progress{' '}
      <span role="img" aria-label="writing-hand">
        ✍️
      </span>
    </Text>
    <Text auxiliary mb={1}>
      5. Keep doing this
    </Text>
    <Text auxiliary mb={1}>
      6. When its ready, press finished
    </Text>
    <Text auxiliary mb={1}>
      7. Be proud{' '}
      <span role="img" aria-label="simple-smile">
        🙂
      </span>
    </Text>
  </Flex>
)
