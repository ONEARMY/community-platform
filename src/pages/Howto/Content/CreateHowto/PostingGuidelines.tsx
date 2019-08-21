import * as React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'

export const PostingGuidelines = () => (
  <Flex card mediumRadius flexDirection={'column'} bg="white" p={4} mt={4}>
    <Heading cardTitle mb={2}>
      How-to Guidelines
    </Heading>
    <Text auxiliary mb={1}>
      1. Titles are powerful. Choose wisely.
    </Text>
    <Text auxiliary mb={1}>
      2. Use tags, that's how we stay organised.
    </Text>
    <Text auxiliary mb={1}>
      3. Upload minimum 3 steps.
    </Text>
    <Text auxiliary mb={1}>
      4. Try to keep it short but informative.
    </Text>
    <Text auxiliary mb={1}>
      5. For each steps try to use an image.
    </Text>
  </Flex>
)
