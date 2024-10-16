import { profileTags } from 'oa-shared'
import { Flex } from 'theme-ui'

import { Category } from '../Category/Category'

import type { ISelectedTags } from 'oa-shared'

export interface IProps {
  tagIds: ISelectedTags
}

export const ProfileTagsList = ({ tagIds }: IProps) => {
  const selectedTagIds = Object.keys(tagIds).filter((id) => tagIds[id] === true)
  const tags = selectedTagIds
    .map((id) => profileTags.find(({ _id }) => id === _id))
    .filter((tag) => tag !== undefined)

  if (tags.length === 0) {
    return null
  }

  return (
    <Flex sx={{ gap: 2 }}>
      {tags.map(
        (tag, index) =>
          tag?.label && (
            <Category key={index} category={{ label: tag.label }} />
          ),
      )}
    </Flex>
  )
}
