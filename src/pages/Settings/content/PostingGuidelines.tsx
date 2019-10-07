import * as React from 'react'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'

// TODO Make a PostingGuidelines component that take the related page as prop

export const PostingGuidelines = () => (
  <Flex card mediumRadius flexDirection={'column'} bg="white" p={4}>
    <Heading medium bold mb={2}>
      Edit tips
    </Heading>
    <Text auxiliary mb={1}>
      1. Changing your Focus will reset your Profile information and pictures.
    </Text>
    <Text auxiliary mb={1}>
      2. Edit where needed and click save below.
    </Text>
  </Flex>
)
