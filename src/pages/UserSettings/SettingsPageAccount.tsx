import React from 'react'
import { observer } from 'mobx-react'
import { ExternalLink } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { DISCORD_INVITE_URL } from 'src/constants'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

import { PatreonIntegration } from './content/fields/PatreonIntegration'
import { ChangeEmailForm } from './content/sections/ChangeEmail.form'
import { ChangePasswordForm } from './content/sections/ChangePassword.form'

export const SettingsPageAccount = observer(() => {
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
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2">{headings.accountSettings}</Heading>
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
