import { Button, Loader, ModerationStatus } from 'oa-components'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Flex, Heading } from 'theme-ui'

import { useQuestionStore } from 'src/stores/Question/question.store'
import { UserNameTag } from '../common/UserNameTag/UserNameTag'

import type { IQuestion } from 'src/models'

export const QuestionListing = () => {
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [questionList, setQuestionList] = useState<IQuestion.Item[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await store.fetchQuestions()
      setQuestionList(questions || [])
      setIsLoading(false)
    }

    fetchQuestions()
  }, [])

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
      <Flex mb={3}>
        <Link to={'/questions/create'}>
          <Button variant={'primary'}>Ask a question</Button>
        </Link>
      </Flex>
      {isLoading ? (
        <Loader />
      ) : questionList.length ? (
        questionList.map((q: any, idx) => {
          const url = `/questions/${encodeURIComponent(q.slug)}`
          return (
            <Card key={idx} mb={3} px={3} py={3} sx={{ position: 'relative' }}>
              <Link to={url} key={q._id}>
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
              </Link>
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
            </Card>
          )
        })
      ) : (
        <Heading>No questions yet</Heading>
      )}
    </>
  )
}
