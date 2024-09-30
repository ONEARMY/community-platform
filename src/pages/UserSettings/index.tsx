import React from 'react'
import { observer } from 'mobx-react'
import { Loader } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { SettingsPage } from './SettingsPage'

import type { IUser } from 'oa-shared'

const Settings = observer(() => {
  const { userStore } = useCommonStores().stores
  const currentUser = userStore.user as IUser

  return currentUser ? <SettingsPage /> : <Loader />
})

export default Settings
