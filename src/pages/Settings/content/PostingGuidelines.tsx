import Heading from 'src/components/Heading'
import Flex from 'src/components/Flex'
import { Link, Text } from 'theme-ui'
import theme from 'src/themes/styled.theme'

export const ProfileGuidelines = () => (
  <Flex card mediumRadius sx={{ flexDirection: 'column' }} bg="white" p={4}>
    <Heading medium bold mb={2}>
      Profile tips
    </Heading>
    <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
      1. Have a look at our{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="https://drive.google.com/open?id=1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd"
      >
        profile guidelines.
      </Link>
    </Text>
    <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
      2. Choose your focus.
    </Text>
    <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
      3. If you want to get a pin on the map check our{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="https://community.preciousplastic.com/academy/guides/community-program"
      >
        Community Program.
      </Link>
    </Text>
    <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
      4. Add a nice description, pics and details.
    </Text>
    <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
      5. If something doesn't work,{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="https://discord.com/invite/SSBrzeR"
      >
        let us know.
      </Link>
    </Text>
  </Flex>
)
