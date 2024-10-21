import { ProfileTagsList } from 'oa-components'
import { type ISelectedTags } from 'oa-shared'
import { getValidTags } from 'src/utils/getValidTags'

interface IProps {
  tagIds: ISelectedTags
}

export const ProfileTags = ({ tagIds }: IProps) => {
  const tags = getValidTags(tagIds)

  if (tags.length === 0) {
    return null
  }

  return <ProfileTagsList tags={tags} />
}
