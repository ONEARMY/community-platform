import { profileTags } from 'oa-shared'

import type { ITag } from 'oa-shared'

const getProfileTags: () => ITag[] = () => {
  return profileTags
}

export const userService = {
  getProfileTags,
}
