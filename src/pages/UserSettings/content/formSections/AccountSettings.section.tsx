import React from 'react'
import { observer } from 'mobx-react'
import { ExternalLink } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { DISCORD_INVITE_URL } from 'src/constants'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

import { ChangeEmailForm } from './ChangeEmail.form'
import { ChangePasswordForm } from './ChangePassword.form'
import { PatreonIntegration } from './PatreonIntegration'

export const AccountSettingsSection = observer(() => {
  const { description, title } = fields.deleteAccount

  const { userStore } = useCommonStores().stores

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Heading as="h2" variant="small">
          {headings.accountSettings}
        </Heading>
        <Text variant="quiet">
          Here you can manage the core settings of your account.
        </Text>
      </Flex>

      <PatreonIntegration user={userStore.activeUser} />
      <ChangeEmailForm />
      <ChangePasswordForm />

      <Text variant="body">
        {title}
        <ExternalLink
          sx={{ ml: 1, textDecoration: 'underline' }}
          href={DISCORD_INVITE_URL}
        >
          {description}
        </ExternalLink>
      </Text>
    </Flex>
  )
})
