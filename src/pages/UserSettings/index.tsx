import React from 'react'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex, Text } from 'theme-ui'

import { SettingsPage } from './SettingsPage'

import type { IUser } from 'src/models/user.models'

const Settings = observer(() => {
  const { userStore } = useCommonStores().stores

  const currentUser = userStore.user as IUser
  return currentUser ? (
    <SettingsPage />
  ) : (
    <Flex sx={{ justifyContent: 'center' }} mt="40px">
      <Text> You can only access the settings page if you are logged in</Text>
    </Flex>
  )
})

export default Settings
