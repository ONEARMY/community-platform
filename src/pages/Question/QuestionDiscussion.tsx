import { DiscussionWrapper } from 'src/common/DiscussionWrapper'

interface IProps {
  questionDocId: string
  setTotalCommentsCount: (number) => void
}

export const QuestionDiscussion = (props: IProps) => {
  const { questionDocId, setTotalCommentsCount } = props

  return (
    <DiscussionWrapper
      sourceType="question"
      sourceId={questionDocId}
      setTotalCommentsCount={setTotalCommentsCount}
    />
  )
}
