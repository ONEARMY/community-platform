import { observer } from 'mobx-react'
import { Loader } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { SettingsPage } from './SettingsPage'

import type { IUserDB } from 'oa-shared'

const Settings = observer(() => {
  const { userStore } = useCommonStores().stores
  const currentUser = userStore.user as IUserDB

  if (!currentUser) {
    return <Loader />
  }

  return <SettingsPage profile={currentUser} />
})

export default Settings
