import { useContext, useEffect } from 'react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { SessionContext } from './SessionContext'

export const UserStoreWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const profile = useContext(SessionContext)
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    if (profile) {
      userStore.refreshActiveUserDetailsById(profile.username)
    }
  }, [profile])

  return children
}
