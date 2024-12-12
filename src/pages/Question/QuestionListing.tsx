import { useEffect, useState } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import { Button, Loader } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { questionService } from 'src/pages/Question/question.service'
import { commentService } from 'src/services/commentService'
import { Flex, Heading } from 'theme-ui'

import { headings, listing } from './labels'
import { QuestionFilterHeader } from './QuestionFilterHeader'
import { QuestionListItem } from './QuestionListItem'

import type { IQuestion } from 'oa-shared'
import type { QuestionSortOption } from './QuestionSortOptions'

export const QuestionListing = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [questions, setQuestions] = useState<IQuestion.Item[]>([])
  const [total, setTotal] = useState<number>(0)
  const [lastVisibleId, setLastVisibleId] = useState<string | undefined>(
    undefined,
  )
  const { userStore } = useCommonStores().stores

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

  const fetchQuestions = async (skipFrom?: string | undefined) => {
    setIsFetching(true)

    try {
      const searchWords = q ? q.toLocaleLowerCase().split(' ') : []

      const result = await questionService.search(
        searchWords,
        category,
        sort,
        skipFrom,
      )

      if (result) {
        if (skipFrom) {
          // if skipFrom is set, means we are requesting another page that should be appended
          setQuestions((questions) => [...questions, ...result.items])
        } else {
          setQuestions(result.items)
        }

        setLastVisibleId(result.lastVisibleId)

        setTotal(result.total)

        getCommentCounts(result.items.map((x) => x._id))
      }
    } catch (error) {
      logger.error('error fetching questions', error)
    }

    setIsFetching(false)
  }

  const getCommentCounts = async (questionIds: string[]) => {
    try {
      const count = await commentService.getCommentCount(questionIds)

      if (count.size > 0) {
        setQuestions((questions) =>
          questions.map((x) => ({ ...x, commentCount: count.get(x._id) || 0 })),
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const showLoadMore =
    !isFetching && questions && questions.length > 0 && questions.length < total

  return (
    <>
      <Flex my={[18, 26]}>
        <Heading
          as="h1"
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

        <Flex sx={{ gap: 2 }}>
          <Link to={userStore.user ? '/questions/create' : '/sign-up'}>
            <Button type="button" data-cy="create" variant="primary">
              {listing.create}
            </Button>
          </Link>
        </Flex>
      </Flex>

      {questions?.length === 0 && !isFetching && (
        <Heading as="h1" sx={{ marginTop: 4 }}>
          {listing.noQuestions}
        </Heading>
      )}

      {questions && questions.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginBottom: 5,
            border: '2px solid black',
            borderRadius: 5,
            background: 'lightGrey',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {questions.map((question, index) => (
            <QuestionListItem key={index} question={question} query={q} />
          ))}
        </ul>
      )}

      {showLoadMore && (
        <Flex
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button
            type="button"
            onClick={() => fetchQuestions(lastVisibleId)}
            data-cy="load-more"
          >
            {listing.loadMore}
          </Button>
        </Flex>
      )}

      {isFetching && <Loader />}
    </>
  )
}
