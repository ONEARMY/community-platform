import { ProfileTagsList } from 'oa-components'
import { getValidTags } from 'src/utils/getValidTags'

import type { ISelectedTags } from 'oa-shared'

export type ShowVisitorModal = () => void

interface IProps {
  tagIds?: ISelectedTags
  openToVisitors: boolean
  isSpace: boolean
  showVisitorModal: ShowVisitorModal
}

export const ProfileTags = (props: IProps) => {
  const { tagIds, isSpace, showVisitorModal } = props
  const tags = getValidTags(tagIds || {})

  return (
    <ProfileTagsList
      tags={tags}
      // openToVisitors={openToVisitors}
      isSpace={isSpace}
      showVisitorModal={showVisitorModal}
      large={true}
    />
  )
}
