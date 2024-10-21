import { profileTags } from 'oa-shared'

import type { ISelectedTags, ITag } from 'oa-shared'

// For ease, duplicated from functions/src/uperUpdates/utils.ts
export const getValidTags = (tagIds: ISelectedTags): ITag[] => {
  const selectedTagIds = Object.keys(tagIds).filter((id) => tagIds[id] === true)

  const tags: ITag[] = selectedTagIds
    .map((id) => profileTags.find(({ _id }) => id === _id))
    .filter((tag): tag is ITag => !!tag)
    .filter(({ _deleted }) => _deleted !== true)

  return tags
}
