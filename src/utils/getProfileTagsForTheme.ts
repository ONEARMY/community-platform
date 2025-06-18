import { allCommunityProfileTags } from 'oa-shared'
import { VITE_THEME } from 'src/config/config'

import type { IProfileTag, MemberOrSpace } from 'oa-shared'

export const getProfileTagsForTheme = (
  profileType?: MemberOrSpace,
): IProfileTag[] => {
  const allThemeProfileTags = allCommunityProfileTags[VITE_THEME]
  return profileType
    ? allThemeProfileTags.filter((tag) => tag.profileType === profileType)
    : allThemeProfileTags
}
