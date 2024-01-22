import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Button, Loader, ModerationStatus } from 'oa-components'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { Card, Flex, Heading } from 'theme-ui'

import { SortFilterHeader } from '../common/SortFilterHeader/SortFilterHeader'
import { UserNameTag } from '../common/UserNameTag/UserNameTag'

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
          .filter((q: any) => q.moderation && q.moderation === 'accepted')
          .map((q: any, idx) => {
            const url = `/questions/${encodeURIComponent(q.slug)}`
            return (
              <Card
                key={idx}
                mb={3}
                px={3}
                py={3}
                sx={{ position: 'relative' }}
              >
                <Flex sx={{ flexDirection: 'column' }}>
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
                </Flex>
              </Card>
            )
          })
      ) : (
        <Heading>No questions yet</Heading>
      )}
    </>
  )
})
