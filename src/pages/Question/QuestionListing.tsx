import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Button, Icon, Loader, ModerationStatus, Tooltip } from 'oa-components'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { Box, Card, Flex, Grid, Heading, Text } from 'theme-ui'

import { SortFilterHeader } from '../common/SortFilterHeader/SortFilterHeader'
import { UserNameTag } from '../common/UserNameTag/UserNameTag'

import type { IQuestionDB } from 'src/models'

const _commonStatisticStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: [1, 2, 2],
}

export const QuestionListing = observer(() => {
  const store = useQuestionStore()
  const { filteredQuestions, isFetching } = store

  return (
    <>
      <Flex my={[18, 26]}>
        <Heading
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 5,
          }}
        >
          Ask your questions and help others out
        </Heading>
      </Flex>
      <Flex
        mb={3}
        sx={{
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
        }}
      >
        <SortFilterHeader store={store} type="question" />
        <Link to={'/questions/create'}>
          <Button variant={'primary'}>Ask a question</Button>
        </Link>
      </Flex>
      {isFetching ? (
        <Loader />
      ) : filteredQuestions && filteredQuestions.length ? (
        filteredQuestions
          .filter(
            (q: IQuestionDB) => q.moderation && q.moderation === 'accepted',
          )
          .map((q: IQuestionDB, idx) => {
            const url = `/questions/${encodeURIComponent(q.slug)}`
            return (
              <Card
                key={idx}
                mb={3}
                px={3}
                py={3}
                sx={{ position: 'relative' }}
              >
                <Grid columns={[1, '3fr 1fr']} gap="40px">
                  <Box sx={{ flexDirection: 'column' }}>
                    <Link to={url} key={q._id}>
                      <Flex sx={{ width: '100%' }}>
                        <Heading
                          as="span"
                          mb={2}
                          sx={{
                            color: 'black',
                            fontSize: [3, 3, 4],
                          }}
                        >
                          {q.title}
                        </Heading>
                      </Flex>
                    </Link>
                    <Flex>
                      <ModerationStatus
                        status={q.moderation}
                        contentType="question"
                        sx={{ top: 0, position: 'absolute', right: 0 }}
                      />
                      <UserNameTag
                        userName={q._createdBy}
                        countryCode={q.creatorCountry}
                        created={q._created}
                        action="Asked"
                      />
                    </Flex>
                  </Box>
                  <Box
                    sx={{
                      display: ['none', 'flex', 'flex'],
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}
                  >
                    <Text
                      data-tip="How useful is it"
                      color="black"
                      sx={_commonStatisticStyle}
                    >
                      {(q.votedUsefulBy || []).length}
                      <Icon glyph="star-active" ml={1} />
                    </Text>
                    <Tooltip />

                    <Text
                      data-tip="Total comments"
                      color="black"
                      sx={_commonStatisticStyle}
                    >
                      {(q as any).commentCount || 0}
                      <Icon glyph="comment" ml={1} />
                    </Text>
                    <Tooltip />
                  </Box>
                </Grid>
              </Card>
            )
          })
      ) : (
        <Heading sx={{ marginTop: 4 }}>
          No questions have been asked yet
        </Heading>
      )}
    </>
  )
})
