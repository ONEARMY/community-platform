import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { fields } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

import { FirebaseNotifications } from './FirebaseNotifications'
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

      <FirebaseNotifications />
      <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
        <SupabaseNotifications />
      </AuthWrapper>
    </Flex>
  )
}
