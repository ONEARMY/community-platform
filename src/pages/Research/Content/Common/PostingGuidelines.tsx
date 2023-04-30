import { Card, Text, Flex, Heading } from 'theme-ui'
import { ExternalLink } from 'oa-components'

export const PostingGuidelines = () => (
  <Card>
    <Flex sx={{ flexDirection: 'column' }} p={4}>
      <Heading mb={2}>How does it work?</Heading>
      <Text mb={1} variant="auxiliary">
        1. Choose a topic you want to research{' '}
        <span role="img" aria-label="raised-hand">
          🙌
        </span>
      </Text>
      <Text mb={1} variant="auxiliary">
        2. Read{' '}
        <ExternalLink sx={{ color: 'blue' }} href="/academy/guides/research">
          our guidelines{' '}
          <span role="img" aria-label="nerd-face">
            🤓
          </span>
        </ExternalLink>
      </Text>
      <Text mb={1} variant="auxiliary">
        3. Write your introduction{' '}
        <span role="img" aria-label="archive-box">
          🗄️
        </span>
      </Text>
      <Text mb={1} variant="auxiliary">
        4. Come back when you made progress{' '}
        <span role="img" aria-label="writing-hand">
          ✍️
        </span>
      </Text>
      <Text mb={1} variant="auxiliary">
        5. Keep doing this
      </Text>
      <Text mb={1} variant="auxiliary">
        6. When its ready, press finished
      </Text>
      <Text mb={1} variant="auxiliary">
        7. Be proud{' '}
        <span role="img" aria-label="simple-smile">
          🙂
        </span>
      </Text>
    </Flex>
  </Card>
)
