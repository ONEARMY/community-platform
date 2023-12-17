import { Loader, ModerationStatus, UsefulStatsButton } from 'oa-components'
import { useState, useEffect } from 'react'
import type { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import type { IQuestion } from 'src/models'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Box, Button, Card, Heading, Text, Flex } from 'theme-ui'
import { UserNameTag } from 'src/pages/common/UserNameTag/UserNameTag'

type IProps = RouteComponentProps<{ slug: string }>

export const QuestionPage = (props: IProps) => {
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<IQuestion.Item | undefined>(
    undefined,
  )
  const [isEditable, setIsEditable] = useState(false)

  useEffect(() => {
    const { slug } = props.match.params
    const fetchQuestions = async () => {
      const question: any = await store.fetchQuestionBySlug(slug)
      store.activeQuestionItem = question || null
      setQuestion(question || null)
      setIsEditable(isAllowedToEditContent(question, store.activeUser))
      setIsLoading(false)
    }

    fetchQuestions()
  }, [isLoading, question])

  const onUsefulClick = async () => {
    if (!store.activeUser?.userName) {
      return null
    }

    // Trigger update without waiting
    const questionId = store.activeQuestionItem?._id
    if (questionId) {
      store.toggleUsefulByUser(questionId, store.activeUser?.userName)
      setQuestion(store.activeQuestionItem)
    }
  }

  return (
    <Box sx={{ p: 7 }}>
      {isLoading ? (
        <Loader />
      ) : question ? (
        <Card sx={{ mt: 4, p: 4, position: 'relative' }}>
          <Flex sx={{ flexWrap: 'wrap', gap: '10px' }}>
            <UsefulStatsButton
              votedUsefulCount={store.votedUsefulCount}
              hasUserVotedUseful={store.userVotedActiveQuestionUseful}
              isLoggedIn={store.activeUser ? true : false}
              onUsefulClick={onUsefulClick}
            />
          </Flex>
          <ModerationStatus
            status={question.moderation}
            contentType="question"
            sx={{ top: 0, position: 'absolute', right: 0 }}
          />

          <Box mt={3} mb={2}>
            <UserNameTag
              userName={question._createdBy}
              countryCode={question.creatorCountry}
              created={question._created}
              action="Asked"
            />
          </Box>

          <Box mt={3} mb={2}>
            <Heading mb={1}>{question.title}</Heading>
            <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
              {question.description}
            </Text>

            {isEditable && (
              <Link to={'/question/' + question.slug + '/edit'}>
                <Button variant={'primary'}>Edit</Button>
              </Link>
            )}
          </Box>
        </Card>
      ) : null}
    </Box>
  )
}
