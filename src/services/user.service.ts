import { getProfileTagsForTheme } from 'src/utils/getProfileTagsForTheme'

import type { ITag } from 'oa-shared'

const getProfileTags: () => ITag[] = () => {
  return getProfileTagsForTheme()
}

export const userService = {
  getProfileTags,
}
