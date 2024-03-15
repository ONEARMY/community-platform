import { TagList as TagListUI } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import type { ISelectedTags } from 'src/models'

interface IProps {
  tags: ISelectedTags
}

export const TagList = ({ tags }: IProps) => {
  const { allTagsByKey } = useCommonStores().stores.tagsStore

  const tagList = Object.keys(tags)
    .filter(Boolean)
    .map((key) => allTagsByKey[key])

  return <TagListUI tags={tagList} />
}
