import { useState } from 'react'
import { DiscussionWrapper } from 'src/common/DiscussionWrapper'

import type { IResearch } from 'src/models'

interface IProps {
  update: IResearch.Update
  research: IResearch.Item | null
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
