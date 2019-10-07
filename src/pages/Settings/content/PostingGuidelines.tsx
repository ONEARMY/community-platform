import * as React from 'react'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'

// TODO Make a PostingGuidelines component that take the related page as prop

export const EditProfileGuidelines = () => (
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
export const CreateProfileGuidelines = () => (
  <Flex card mediumRadius flexDirection={'column'} bg="white" p={4}>
    <Heading medium bold mb={2}>
      Profile tips
    </Heading>
    <Text auxiliary mb={1}>
      1. Focusing on one task will make you excel at recycling plastic.
    </Text>
    <Text auxiliary mb={1}>
      2. Workspaces, Local Communities, Collection Points and Machine Shops will
      have to be approved. Make sure to upload relevant pictures.
    </Text>
    <Text auxiliary mb={1}>
      3. Choose your primary contact method so people can connect with you.
    </Text>
    <Text auxiliary mb={1}>
      4. Workspaces, Local Communities, Collection Points and Machine Shops
      automatically get a pin on the map.
    </Text>
  </Flex>
)
