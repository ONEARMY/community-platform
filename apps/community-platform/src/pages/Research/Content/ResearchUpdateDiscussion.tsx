import { useState } from 'react'

import { DiscussionWrapper } from '../../../common/DiscussionWrapper'

import type { IResearchItem, IResearchUpdate } from '../../../models'

interface IProps {
  update: IResearchUpdate
  research: IResearchItem | null
  showComments?: boolean
}

export const ResearchUpdateDiscussion = (props: IProps) => {
  const { update, research, showComments } = props
  const [, setTotalCommentsCount] = useState<number>(0)

  if (!research) return null

  return (
    <DiscussionWrapper
      sourceType="researchUpdate"
      sourceId={update._id}
      setTotalCommentsCount={setTotalCommentsCount}
      showComments={showComments}
      primaryContentId={research._id}
      canHideComments
    />
  )
}
