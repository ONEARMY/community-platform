import { TagList as TagListUI } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import type { ISelectedTags } from 'oa-shared'

interface IProps {
  tags: ISelectedTags | undefined
}

export const TagList = ({ tags }: IProps) => {
  if (!tags) {
    return null
  }

  const { allTagsByKey } = useCommonStores().stores.tagsStore

  const tagList = Object.keys(tags)
    .filter(Boolean)
    .map((key) => allTagsByKey[key])

  return tagList && tagList.length > 0 && <TagListUI tags={tagList} />
}
