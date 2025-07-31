import { fields } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

import { SupabaseNotifications } from './SupabaseNotifications'

export const SettingsPageNotifications = () => {
  const { description, title } = fields.emailNotifications

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2">{title}</Heading>
        <Text variant="quiet">{description}</Text>
      </Flex>

      <SupabaseNotifications />
    </Flex>
  )
}
