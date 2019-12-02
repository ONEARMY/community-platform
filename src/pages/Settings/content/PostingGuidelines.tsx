import * as React from 'react'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { Link } from 'rebass'
import theme from 'src/themes/styled.theme'

export const EditProfileGuidelines = () => (
  <Flex card mediumRadius flexDirection={'column'} bg="white" p={4}>
    <Heading medium bold mb={2}>
      Edit tips
    </Heading>
    <Text auxiliary mb={1}>
      1. Have a quick look at our{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="https://drive.google.com/open?id=1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd"
      >
        profile guidelines.
      </Link>
    </Text>
    <Text auxiliary mb={1}>
      2. Choose your focus.
    </Text>
    <Text auxiliary mb={1}>
      3. Fill in nice text, image and details.
    </Text>
    <Text auxiliary mb={1}>
      4. You can edit & share again later.
    </Text>
    <Text auxiliary mb={1}>
      5. If something doesn't work,{' '}
      <Link
        color={theme.colors.softblue}
        target="_blank"
        href="https://discord.gg/XFKuEWc"
      >
        let us know.
      </Link>
    </Text>
  </Flex>
)
export const CreateProfileGuidelines = () => (
  <Flex card mediumRadius flexDirection={'column'} bg="white" p={4}>
    <Heading medium bold mb={2}>
      Profile tips
    </Heading>
    <Text auxiliary mb={1}>
      1. Have a quick look at our{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="https://drive.google.com/open?id=1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd"
      >
        profile guidelines.
      </Link>
    </Text>
    <Text auxiliary mb={1}>
      2. Choose your focus.
    </Text>
    <Text auxiliary mb={1}>
      3. Fill in nice text, image and details.
    </Text>
    <Text auxiliary mb={1}>
      4. You can edit & share again later.
    </Text>
    <Text auxiliary mb={1}>
      5. If something doesn't work,{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="https://discord.gg/Dw9x8r"
      >
        let us know.
      </Link>
    </Text>
  </Flex>
)
