import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Button,
  Category,
  IconCountWithTooltip,
  Loader,
  ModerationStatus,
} from 'oa-components'
import { logger } from 'src/logger'
import { questionService } from 'src/pages/Question/question.service'
import { Box, Card, Flex, Grid, Heading } from 'theme-ui'

import { UserNameTag } from '../common/UserNameTag/UserNameTag'
import { ITEMS_PER_PAGE } from './constants'
import { headings, listing } from './labels'
import { QuestionFilterHeader } from './QuestionFilterHeader'
import { QuestionSortOptions } from './QuestionSortOptions'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { IQuestion } from 'src/models'

export const QuestionListing = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [questions, setQuestions] = useState<IQuestion.Item[]>([])
  const [total, setTotal] = useState<number>(0)
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
  >(undefined)

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') as QuestionSortOptions

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set('sort', QuestionSortOptions.MostRelevant)
      } else {
        params.set('sort', QuestionSortOptions.Newest)
      }
      setSearchParams(params)
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchQuestions()
    }
  }, [q, category, sort])

  const fetchQuestions = async (
    skipFrom?: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ) => {
    setIsFetching(true)

    try {
      const searchWords = q ? q.toLocaleLowerCase().split(' ') : []

      const result = await questionService.search(
        searchWords,
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

      setLastVisible(result.lastVisible)

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
          {headings.list}
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
          <Button data-cy="create" variant="primary">
            {listing.create}
          </Button>
        </Link>
      </Flex>

      {questions?.length === 0 && !isFetching && (
        <Heading sx={{ marginTop: 4 }}>{listing.noQuestions}</Heading>
      )}

      {questions &&
        questions.length > 0 &&
        questions.map((question) => {
          const url = `/questions/${encodeURIComponent(question.slug)}`
          return (
            <Card
              data-cy="question-list-item"
              key={question._id}
              mb={3}
              px={3}
              py={3}
              sx={{ position: 'relative' }}
            >
              <Grid columns={[1, '3fr 1fr']} gap="40px">
                <Box sx={{ flexDirection: 'column' }}>
                  <Link to={url} key={question._id}>
                    <Flex
                      sx={{
                        width: '100%',

                        flexDirection: ['column', 'row'],
                        gap: [0, 3],
                        mb: [1, 0],
                      }}
                    >
                      <Heading
                        as="span"
                        mb={1}
                        sx={{
                          color: 'black',
                          fontSize: [3, 3, 4],
                        }}
                      >
                        {question.title}
                      </Heading>
                      {question.questionCategory && (
                        <Category
                          category={question.questionCategory}
                          sx={{ fontSize: 2 }}
                        />
                      )}
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
                </Box>
                <Box
                  sx={{
                    display: ['none', 'flex', 'flex'],
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <IconCountWithTooltip
                    count={(question.votedUsefulBy || []).length}
                    icon="star-active"
                    text={listing.usefulness}
                  />

                  <IconCountWithTooltip
                    count={(question as any).commentCount || 0}
                    icon="comment"
                    text={listing.totalComments}
                  />
                </Box>
              </Grid>
            </Card>
          )
        })}

      {!isFetching &&
        questions &&
        questions.length > 0 &&
        questions.length < total && (
          <Flex
            sx={{
              justifyContent: 'center',
            }}
          >
            <Button onClick={() => fetchQuestions(lastVisible)}>
              {listing.loadMore}
            </Button>
          </Flex>
        )}

      {isFetching && <Loader />}
    </>
  )
}
