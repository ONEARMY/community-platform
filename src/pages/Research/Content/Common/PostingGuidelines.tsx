import { Link, Text } from 'theme-ui'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import theme from 'src/themes/styled.theme'

export const PostingGuidelines = () => (
  <Flex card mediumRadius sx={{ flexDirection: 'column' }} bg="white" p={4}>
    <Heading medium bold mb={2}>
      How does it work?
    </Heading>
    <Text mb={1} sx={{ ...theme.typography.auxiliary }}>
      1. Choose a topic you want to research{' '}
      <span role="img" aria-label="raised-hand">
        🙌
      </span>
    </Text>
    <Text mb={1} sx={{ ...theme.typography.auxiliary }}>
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
    <Text mb={1} sx={{ ...theme.typography.auxiliary }}>
      3. Write your introduction{' '}
      <span role="img" aria-label="archive-box">
        🗄️
      </span>
    </Text>
    <Text mb={1} sx={{ ...theme.typography.auxiliary }}>
      4. Come back when you made progress{' '}
      <span role="img" aria-label="writing-hand">
        ✍️
      </span>
    </Text>
    <Text mb={1} sx={{ ...theme.typography.auxiliary }}>
      5. Keep doing this
    </Text>
    <Text mb={1} sx={{ ...theme.typography.auxiliary }}>
      6. When its ready, press finished
    </Text>
    <Text mb={1} sx={{ ...theme.typography.auxiliary }}>
      7. Be proud{' '}
      <span role="img" aria-label="simple-smile">
        🙂
      </span>
    </Text>
  </Flex>
)
