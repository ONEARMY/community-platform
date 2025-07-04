import { useContext, useEffect } from 'react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { profileStore } from 'src/stores/profile/profileStore'

import { SessionContext } from './SessionContext'

export const UserStoreWrapper = (props: { children: React.ReactNode }) => {
  const user = useContext(SessionContext)
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    if (!user?.id) {
      userStore._updateActiveUser(null)
      return
    }

    profileStore.refreshActiveUser()
    userStore.refreshActiveUserDetailsById(user.user_metadata.username)
  }, [user?.id])

  return props.children
}
