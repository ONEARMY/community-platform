import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import { Button, Loader } from 'oa-components'
import { logger } from 'src/logger'
import { Card, Flex, Heading } from 'theme-ui'

import { listing } from './labels'
import { questionService } from './questionContent.service'
import { QuestionListHeader } from './QuestionListHeader'
import { QuestionListItem } from './QuestionListItem'

import type { Question } from 'oa-shared'
import type { QuestionSortOption } from './QuestionSortOptions'

export const QuestionListing = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [total, setTotal] = useState<number>(0)

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') as QuestionSortOption

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString())

      if (q) {
        params.set('sort', 'MostRelevant')
      } else {
        params.set('sort', 'Newest')
      }
      setSearchParams(params)
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchQuestions()
    }
  }, [q, category, sort])

  const fetchQuestions = async (skip: number = 0) => {
    setIsFetching(true)

    try {
      const result = await questionService.search(q, category, sort, skip)

      if (result) {
        if (skip) {
          // if skipFrom is set, means we are requesting another page that should be appended
          setQuestions((questions) => [...questions, ...result.items])
        } else {
          setQuestions(result.items)
        }

        setTotal(result.total)
      }
    } catch (error) {
      logger.error('error fetching questions', error)
    }

    setIsFetching(false)
  }

  const showLoadMore =
    !isFetching && questions && questions.length > 0 && questions.length < total

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <QuestionListHeader />

      {questions?.length === 0 && !isFetching && (
        <Heading as="h1" sx={{ marginTop: 4 }}>
          {listing.noQuestions}
        </Heading>
      )}

      {questions && questions.length > 0 && (
        <Card
          as="ul"
          sx={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginBottom: 2,
            background: 'lightGrey',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
          variant="responsive"
        >
          {questions.map((question, index) => (
            <QuestionListItem key={index} question={question} query={q} />
          ))}
        </Card>
      )}

      {showLoadMore && (
        <Flex sx={{ justifyContent: 'center' }}>
          <Button
            type="button"
            onClick={() => fetchQuestions(questions.length)}
            data-cy="load-more"
          >
            {listing.loadMore}
          </Button>
        </Flex>
      )}

      {isFetching && <Loader />}
    </Flex>
  )
}
