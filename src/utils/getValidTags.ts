import { getProfileTagsForTheme } from './getProfileTagsForTheme'

import type { IProfileTag, ISelectedTags } from 'oa-shared'

// For ease, duplicated from functions/src/uperUpdates/utils.ts
export const getValidTags = (tagIds: ISelectedTags): IProfileTag[] => {
  const selectedTagIds = Object.keys(tagIds).filter((id) => tagIds[id] === true)

  const tags: IProfileTag[] = selectedTagIds
    .map((id) => getProfileTagsForTheme().find(({ _id }) => id === _id))
    .filter((tag): tag is IProfileTag => !!tag)
    .filter(({ _deleted }) => _deleted !== true)

  return tags
}
