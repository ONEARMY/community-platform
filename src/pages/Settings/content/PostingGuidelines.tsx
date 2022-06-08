import { Heading, Card, Flex, Link as ExternalLink, Text } from 'theme-ui'
import theme from 'src/themes/styled.theme'

export const ProfileGuidelines = () => (
  <Card>
    <Flex sx={{ flexDirection: 'column' }} p={4}>
      <Heading mb={2}>Profile tips</Heading>
      <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
        1. Have a look at our{' '}
        <ExternalLink
          target="_blank"
          href="https://drive.google.com/open?id=1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd"
        >
          profile guidelines.
        </ExternalLink>
      </Text>
      <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
        2. Choose your focus.
      </Text>
      <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
        3. If you want to get a pin on the map check our{' '}
        <ExternalLink
          target="_blank"
          href="https://community.preciousplastic.com/academy/guides/community-program"
        >
          Community Program.
        </ExternalLink>
      </Text>
      <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
        4. Add a nice description, pics and details.
      </Text>
      <Text sx={{ ...theme.typography.auxiliary }} mb={1}>
        5. If something doesn't work,{' '}
        <ExternalLink target="_blank" href="https://discord.com/invite/SSBrzeR">
          let us know.
        </ExternalLink>
      </Text>
    </Flex>
  </Card>
)
