import { DiscussionWrapper } from 'src/common/DiscussionWrapper'
import { Card, Flex } from 'theme-ui'

interface IProps {
  docId: string
  setTotalCommentsCount: (number) => void
}

export const LibraryDiscussion = (props: IProps) => {
  const { docId, setTotalCommentsCount } = props

  return (
    <Flex
      mt={5}
      sx={{ flexDirection: 'column', alignItems: 'center' }}
      data-cy="howto-comments"
    >
      <Flex
        sx={{
          alignItems: 'stretch',
          flexDirection: 'column',
          marginBottom: [2, 2, 4],
          width: ['100%', '100%', `90%`, `${(2 / 3) * 100}%`],
        }}
      >
        <Card
          variant="responsive"
          sx={{ background: 'softblue', gap: 2, padding: 3 }}
        >
          <DiscussionWrapper
            sourceType="howto"
            sourceId={docId}
            setTotalCommentsCount={setTotalCommentsCount}
          />
        </Card>
      </Flex>
    </Flex>
  )
}
