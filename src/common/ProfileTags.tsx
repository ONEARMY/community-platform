import { getValidTags } from 'src/utils/getValidTags'

import type { ISelectedTags, UserVisitorPreference } from 'oa-shared'
import { ProfileTagsList } from 'oa-components'

interface IProps {
  tagIds?: ISelectedTags
  openToVisitors?: UserVisitorPreference
}

export const ProfileTags = ({ tagIds, openToVisitors }: IProps) => {
  const tags = getValidTags(tagIds || {})

  return <ProfileTagsList tags={tags} openToVisitors={openToVisitors} large={true}/>
}
