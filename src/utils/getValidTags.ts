import { profileTags } from 'oa-shared'

import type { ISelectedTags } from 'oa-shared'

export const getValidTags = (tagIds: ISelectedTags) => {
  const selectedTagIds = Object.keys(tagIds).filter((id) => tagIds[id] === true)
  const tags = selectedTagIds
    .map((id) => profileTags.find(({ _id }) => id === _id))
    .filter((tag) => tag !== undefined)
    .filter(({ _deleted }) => _deleted !== true)

  return tags
}
