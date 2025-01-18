import { useContext, useEffect } from 'react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { SessionContext } from './SessionContext'

export const UserStoreWrapper = (props: { children: React.ReactNode }) => {
  const user = useContext(SessionContext)
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const { profile } = await response.json()

          // TODO: actually use the profile from supabase?
          userStore.refreshActiveUserDetailsById(profile.username)
          return
        }
      } catch (error) {
        console.error(error)
      }

      userStore._updateActiveUser(null)
    }

    syncProfile()
  }, [user?.id])

  return props.children
}
