import React from 'react'
import { observer } from 'mobx-react'
import { ExternalLink } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { DISCORD_INVITE_URL } from 'src/constants'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

import { ChangeEmailForm } from './ChangeEmail.form'
import { ChangePasswordForm } from './ChangePassword.form'

export const AccountSettingsSection = observer(() => {
  const { userStore } = useCommonStores().stores
  const { description, title } = fields.deleteAccount

  return (
    <Card sx={{ background: 'red2', padding: 4, marginTop: 4 }}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading variant="small">{headings.accountSettings}</Heading>
      </Flex>
      <Box mt={2}>
        <ChangeEmailForm userStore={userStore} />
        <ChangePasswordForm userStore={userStore} />
      </Box>
      <Box mt={2}>
        <Text variant="body">
          {title}
          <ExternalLink
            sx={{ ml: 1, textDecoration: 'underline' }}
            href={DISCORD_INVITE_URL}
          >
            {description}
          </ExternalLink>
        </Text>
      </Box>
    </Card>
  )
})
