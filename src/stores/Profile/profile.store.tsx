import { createContext, useContext, useEffect } from 'react'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { SessionContext } from 'src/pages/common/SessionContext'
import { profileService } from 'src/services/profileService'
import { profileTypesService } from 'src/services/profileTypesService'

import type { Profile, ProfileType } from 'oa-shared'

export class ProfileStore {
  profile?: Profile = undefined
  profileTypes?: ProfileType[] = undefined

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

  update = (value: Profile) => {
    this.profile = value
  }

  initProfileTypes = async () => {
    const profileTypes = await profileTypesService.getProfileTypes()

    runInAction(() => {
      // runInAction because of async method
      this.profileTypes = profileTypes
    })
  }

  getProfileTypeByName = (name: string) => {
    return this.profileTypes?.find((type) => type.name === name)
  }

  constructor() {
    makeObservable(this, {
      profile: observable,
      profileTypes: observable,
      refresh: action,
      clear: action,
      update: action,
      initProfileTypes: action,
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
  const claims = useContext(SessionContext)

  useEffect(() => {
    if (!claims?.sub) {
      profileStore.clear()
      return
    }

    profileStore.refresh()
  }, [claims?.sub])

  useEffect(() => {
    profileStore.initProfileTypes()
  }, [])

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
