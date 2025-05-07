import { ProfileTagsList } from 'oa-components'
import { getValidTags } from 'src/utils/getValidTags'

import type { ISelectedTags, IUser } from 'oa-shared'

export type ShowVisitorModal = () => void

interface IProps {
  tagIds?: ISelectedTags
  openToVisitors?: IUser['openToVisitors']
  showVisitorModal: ShowVisitorModal
}

export const ProfileTags = (props: IProps) => {
  const { tagIds, openToVisitors, showVisitorModal } = props
  const tags = getValidTags(tagIds || {})

  return (
    <ProfileTagsList
      tags={tags}
      openToVisitors={openToVisitors}
      showVisitorModal={showVisitorModal}
      large={true}
    />
  )
}
