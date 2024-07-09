import React from 'react'
import { observer } from 'mobx-react'
import { ExternalLink } from 'oa-components'
import { DISCORD_INVITE_URL } from 'src/constants'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { Card, Flex, Heading, Text } from 'theme-ui'

import { ChangeEmailForm } from './ChangeEmail.form'
import { ChangePasswordForm } from './ChangePassword.form'

export const AccountSettingsSection = observer(() => {
  const { description, title } = fields.deleteAccount

  return (
    <Card sx={{ padding: 4 }}>
      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Heading as="h2">{headings.accountSettings}</Heading>
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
    </Card>
  )
})
