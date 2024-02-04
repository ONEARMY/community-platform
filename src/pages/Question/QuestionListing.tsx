import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Loader, ModerationStatus } from 'oa-components'
import { logger } from 'src/logger'
import { questionService } from 'src/pages/Question/question.service'
import { ItemSortingOption } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'
import { Card, Flex, Heading } from 'theme-ui'

import { UserNameTag } from '../common/UserNameTag/UserNameTag'
import { QuestionFilterHeader } from './QuestionFilterHeader'

import type { DocumentReference } from 'firebase/firestore'
import type { IQuestion } from 'src/models'

const ITEMS_PER_PAGE = 10

export const QuestionListing = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') as ItemSortingOption
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [questions, setQuestions] = useState<
    (IQuestion.Item & { ref: DocumentReference })[]
  >([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set('sort', ItemSortingOption.MostRelevant)
      } else {
        params.set('sort', ItemSortingOption.Newest)
      }
      setSearchParams(params)
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchQuestions()
    }
  }, [q, category, sort])

  const fetchQuestions = async (skipFrom?: DocumentReference) => {
    setIsFetching(true)

    try {
      const result = await questionService.search(
        q,
        category,
        sort,
        skipFrom,
        ITEMS_PER_PAGE,
      )

      if (skipFrom) {
        // if skipFrom is set, means we are requesting another page that should be appended
        setQuestions((questions) => [...questions, ...result.items])
      } else {
        setQuestions(result.items)
      }

      setTotal(result.total)
    } catch (error) {
      logger.error('error fetching questions', error)
    }

    setIsFetching(false)
  }

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
        <QuestionFilterHeader />
        <Link to="/questions/create">
          <Button variant="primary">Ask a question</Button>
        </Link>
      </Flex>

      {questions?.length === 0 && !isFetching && (
        <Heading sx={{ marginTop: 4 }}>
          No questions have been asked yet
        </Heading>
      )}

      {questions &&
        questions.length > 0 &&
        questions.map((question) => {
          const url = `/questions/${encodeURIComponent(question.slug)}`
          return (
            <Card
              key={question._id}
              mb={3}
              px={3}
              py={3}
              sx={{ position: 'relative' }}
            >
              <Flex sx={{ flexDirection: 'column' }}>
                <Link to={url} key={question._id}>
                  <Flex sx={{ width: '100%' }}>
                    <Heading
                      as="span"
                      mb={2}
                      sx={{
                        color: 'black',
                        fontSize: [3, 3, 4],
                      }}
                    >
                      {question.title}
                    </Heading>
                  </Flex>
                </Link>
                <Flex>
                  <ModerationStatus
                    status={question.moderation}
                    contentType="question"
                    sx={{ top: 0, position: 'absolute', right: 0 }}
                  />
                  <UserNameTag
                    userName={question._createdBy}
                    countryCode={question.creatorCountry}
                    created={question._created}
                    action="Asked"
                  />
                </Flex>
              </Flex>
            </Card>
          )
        })}

      {!isFetching &&
        questions &&
        questions.length > 0 &&
        questions.length < total && (
          <Button
            style={{ margin: '0 auto' }}
            onClick={() => fetchQuestions(questions[questions.length - 1].ref)}
          >
            Load More
          </Button>
        )}

      {isFetching && <Loader />}
    </>
  )
}
