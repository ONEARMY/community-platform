import { createContext, useContext, useEffect } from 'react'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { SessionContext } from 'src/pages/common/SessionContext'
import { profileService } from 'src/services/profileService'

import type { Profile } from 'oa-shared'

export class ProfileStore {
  profile?: Profile = undefined

  refresh = async () => {
    const profile = await profileService.get()
    runInAction(() => {
      // runInAction because of async method
      this.profile = profile
    })
  }

  clear = () => {
    this.profile = undefined
  }

  constructor() {
    makeObservable(this, {
      profile: observable,
      refresh: action,
      clear: action,
    })
  }
}

const profileStore = new ProfileStore()

const ProfileStoreContext = createContext<ProfileStore | null>(null)

export const ProfileStoreProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const user = useContext(SessionContext)

  useEffect(() => {
    if (!user?.id) {
      profileStore.clear()
      return
    }

    profileStore.refresh()
  }, [user?.id])

  return (
    <ProfileStoreContext.Provider value={profileStore}>
      {children}
    </ProfileStoreContext.Provider>
  )
}

export const useProfileStore = () => {
  const store = useContext(ProfileStoreContext)
  if (!store) {
    throw new Error('useProfileStore must be used within ProfileStoreProvider')
  }
  return store
}
