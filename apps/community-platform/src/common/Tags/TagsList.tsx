import { TagList as TagListUI } from '@onearmy.apps/components'

import { useCommonStores } from '../../common/hooks/useCommonStores'

import type { ISelectedTags } from '../../models'

interface IProps {
  tags: ISelectedTags | undefined
}

export const TagList = ({ tags }: IProps) => {
  const { allTagsByKey } = useCommonStores().stores.tagsStore

  if (!tags) return

  const tagList = Object.keys(tags)
    .filter(Boolean)
    .map((key) => allTagsByKey[key])

  return !!tagList && <TagListUI tags={tagList} />
}
