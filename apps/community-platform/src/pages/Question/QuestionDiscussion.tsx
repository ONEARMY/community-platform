import { Card } from 'theme-ui'

import { DiscussionWrapper } from '../../common/DiscussionWrapper'

interface IProps {
  questionDocId: string
  setTotalCommentsCount: (number: number) => void
}

export const QuestionDiscussion = (props: IProps) => {
  const { questionDocId, setTotalCommentsCount } = props

  return (
    <Card
      sx={{
        marginTop: 5,
        padding: 4,
      }}
    >
      <DiscussionWrapper
        sourceType="question"
        sourceId={questionDocId}
        setTotalCommentsCount={setTotalCommentsCount}
      />
    </Card>
  )
}
