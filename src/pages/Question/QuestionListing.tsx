import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Loader } from 'oa-components'
import { logger } from 'src/logger'
import { questionService } from 'src/pages/Question/question.service'
import { Flex, Heading } from 'theme-ui'

import { ITEMS_PER_PAGE } from './constants'
import { headings, listing } from './labels'
import { QuestionFilterHeader } from './QuestionFilterHeader'
import { QuestionListItem } from './QuestionListItem'
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
        questions.map((question, index) => (
          <QuestionListItem key={index} question={question} query={q} />
        ))}

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
