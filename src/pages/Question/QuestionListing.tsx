import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Loader } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { questionService } from 'src/pages/Question/question.service'
import { Flex, Heading } from 'theme-ui'

import DraftButton from '../common/Drafts/DraftButton'
import useDrafts from '../common/Drafts/useDrafts'
import { ITEMS_PER_PAGE } from './constants'
import { headings, listing } from './labels'
import { QuestionFilterHeader } from './QuestionFilterHeader'
import { QuestionListItem } from './QuestionListItem'

import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import type { IQuestion } from 'src/models'
import type { QuestionSortOption } from './QuestionSortOptions'

export const QuestionListing = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [questions, setQuestions] = useState<IQuestion.Item[]>([])
  const [total, setTotal] = useState<number>(0)
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
  >(undefined)
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<IQuestion.Item>({
      getDraftCount: questionService.getDraftCount,
      getDrafts: questionService.getDrafts,
    })
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
        {!showDrafts ? <QuestionFilterHeader /> : <div></div>}

        <Flex sx={{ gap: 2 }}>
          {userStore.user && (
            <DraftButton
              showDrafts={showDrafts}
              draftCount={draftCount}
              handleShowDrafts={handleShowDrafts}
            />
          )}
          <Link to={userStore.user ? '/questions/create' : '/sign-up'}>
            <Button data-cy="create" variant="primary">
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

      {showDrafts ? (
        drafts.map((item) => {
          return <QuestionListItem key={item._id} question={item} query={q} />
        })
      ) : (
        <>
          {questions &&
            questions.length > 0 &&
            questions.map((question, index) => (
              <QuestionListItem key={index} question={question} query={q} />
            ))}

          {showLoadMore && (
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
        </>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}
    </>
  )
}
