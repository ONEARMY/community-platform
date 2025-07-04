import { computed, signal } from '@preact/signals'
import { profileService } from 'src/services/profileService'

import type { Profile } from 'oa-shared'

// value can be changed - only change through ProfileStore methods
const _profile = signal<Profile | undefined>()

// export a readonly value (computed makes it readonly)
export const profile = computed(() => _profile.value)

const refresh = async () => {
  const value = await profileService.get()

  if (value) {
    _profile.value = value
  }
}

const update = async (value: Profile) => {
  // TODO: only accept values the user is allowed to change
  const profile = await profileService.update(value)
  _profile.value = profile
}

export const profileStore = {
  refresh,
  update,
}
