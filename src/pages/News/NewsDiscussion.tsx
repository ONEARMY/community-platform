import { DiscussionWrapper } from 'src/common/DiscussionWrapper'
import { Card } from 'theme-ui'

interface IProps {
  newsDocId: string
  setTotalCommentsCount: (number) => void
}

export const NewsDiscussion = (props: IProps) => {
  const { newsDocId, setTotalCommentsCount } = props

  return (
    <Card
      sx={{
        marginTop: 5,
        padding: 4,
      }}
    >
      <DiscussionWrapper
        sourceType="news"
        sourceId={newsDocId}
        setTotalCommentsCount={setTotalCommentsCount}
      />
    </Card>
  )
}
