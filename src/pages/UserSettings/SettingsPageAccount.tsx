import { observer } from 'mobx-react'
import { headings } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

import { DeleteAccount } from './content/fields/DeleteAccount.field'
import { PatreonIntegration } from './content/fields/PatreonIntegration'
import { ChangeEmailForm } from './content/sections/ChangeEmail.form'
import { ChangePasswordForm } from './content/sections/ChangePassword.form'

export const SettingsPageAccount = observer(() => {
  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2">{headings.accountSettings}</Heading>
        <Text variant="quiet">
          Here you can manage the core settings of your account.
        </Text>
      </Flex>

      <PatreonIntegration />
      <ChangePasswordForm />
      <ChangeEmailForm />
      <DeleteAccount />
    </Flex>
  )
})
