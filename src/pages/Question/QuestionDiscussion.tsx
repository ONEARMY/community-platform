import { DiscussionWrapper } from 'src/common/DiscussionWrapper'
import { Card } from 'theme-ui'

interface IProps {
  questionDocId: string
  setTotalCommentsCount: (number) => void
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
