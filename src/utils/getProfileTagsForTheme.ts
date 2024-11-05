import { allCommunityProfileTags } from 'oa-shared'
import { VITE_THEME } from 'src/config/config'

export const getProfileTagsForTheme = () => {
  return allCommunityProfileTags[VITE_THEME]
}
