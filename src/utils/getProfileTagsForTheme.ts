import { allCommunityProfileTags } from 'oa-shared'

import type { IProfileTag, MemberOrSpace } from 'oa-shared'

export const getProfileTagsForTheme = (
  profileType?: MemberOrSpace,
): IProfileTag[] => {
  const allThemeProfileTags =
    allCommunityProfileTags[import.meta.env.VITE_THEME]
  return profileType
    ? allThemeProfileTags.filter((tag) => tag.profileType === profileType)
    : allThemeProfileTags
}
