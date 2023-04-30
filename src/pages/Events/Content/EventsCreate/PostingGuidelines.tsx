import { Heading, Card, Text, Flex } from 'theme-ui'

// TODO : create a component to avoid duplicate with how-to's guidelines

export const PostingGuidelines = () => {
  return (
    <Card p={4}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Heading mb={2}>Event Posting Guidelines</Heading>
        <Text variant="auxiliary" mb={1}>
          1. Use a platform like Facebook, Eventbrite, Meetup, etc.
        </Text>
        <Text variant="auxiliary" mb={1}>
          2. Copy and paste the url.
        </Text>
        <Text variant="auxiliary" mb={1}>
          3. Add additional information.
        </Text>
        <Text variant="auxiliary" mb={1}>
          4. Reach an army of likeminded people :)
        </Text>
      </Flex>
    </Card>
  )
}
