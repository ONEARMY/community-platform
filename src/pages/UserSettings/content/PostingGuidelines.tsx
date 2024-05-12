import { useTheme } from '@emotion/react'
import { ExternalLink } from 'oa-components'
import { DISCORD_INVITE_URL } from 'src/constants'
import { Card, Flex, Heading, Text } from 'theme-ui'

export const ProfileGuidelines = () => {
  const theme = useTheme()

  return (
    <Card>
      <Flex sx={{ flexDirection: 'column' }} p={4}>
        <Heading as="h2" mb={2}>
          Profile tips
        </Heading>
        <Text variant="auxiliary" mb={1}>
          1. Have a look at our{' '}
          <ExternalLink href={theme.profileGuidelinesURL}>
            profile guidelines.
          </ExternalLink>
        </Text>
        <Text variant="auxiliary" mb={1}>
          2. Choose your focus.
        </Text>
        <Text variant="auxiliary" mb={1}>
          3. If you want to get a pin on the map check our{' '}
          <ExternalLink href={theme.communityProgramURL}>
            Community Program.
          </ExternalLink>
        </Text>
        <Text variant="auxiliary" mb={1}>
          4. Add a nice description, pics and details.
        </Text>
        <Text variant="auxiliary" mb={1}>
          5. If something doesn't work,{' '}
          <ExternalLink href={DISCORD_INVITE_URL}>let us know.</ExternalLink>
        </Text>
      </Flex>
    </Card>
  )
}
