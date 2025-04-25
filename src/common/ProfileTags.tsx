import { ExtendedTagsList } from 'oa-components'
import { getValidTags } from 'src/utils/getValidTags'

import type { ISelectedTags, UserVisitorPreference } from 'oa-shared'

interface IProps {
  tagIds?: ISelectedTags
  openToVisitors?: UserVisitorPreference
}

export const ProfileTags = ({ tagIds, openToVisitors }: IProps) => {
  const tags = getValidTags(tagIds || {})

  return <ExtendedTagsList tags={tags} openToVisitors={openToVisitors}/>
}
