import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FollowButton,
  Loader,
  ModerationStatus,
  UsefulStatsButton,
} from 'oa-components'
import { logger } from 'src/logger'
import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Box, Button, Card, Flex, Heading, Text } from 'theme-ui'

import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'
import { QuestionComments } from './QuestionComments'

import type { IDiscussionComment, IQuestion } from 'src/models'

export const QuestionPage = () => {
  const { slug } = useParams()
  const store = useQuestionStore()
  const discussionStore = useDiscussionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<IQuestion.Item | undefined>()
  const [isEditable, setIsEditable] = useState(false)
  const [hasUserSubscribed, setHasUserSubscribed] = useState(false)
  const [comments, setComments] = useState<IDiscussionComment[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      if (slug) {
        const foundQuestion: any = await store.fetchQuestionBySlug(slug)
        store.activeQuestionItem = foundQuestion || null

        if (isLoading) {
          setQuestion(foundQuestion || null)

          if (store.activeUser) {
            setIsEditable(
              isAllowedToEditContent(foundQuestion, store.activeUser),
            )
          }
        }

        setHasUserSubscribed(
          foundQuestion?.subscribers?.includes(store.activeUser?.userName),
        )
        if (foundQuestion && discussionStore) {
          try {
            const discussion =
              await discussionStore.fetchOrCreateDiscussionBySource(
                foundQuestion._id,
                'question',
              )
            if (discussion) {
              setComments(discussion.comments)
            }
          } catch (err) {
            logger.error('Failed to fetch discussion', {
              err,
              questionId: foundQuestion._id,
            })
          }
        }
      }

      setIsLoading(false)
    }
    fetchQuestions()

    return () => {
      setIsLoading(true)
    }
  }, [slug])

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

  const isLoggedIn = store.activeUser ? true : false
  const onFollowClick = () => {
    if (question) {
      store.toggleSubscriberStatusByUserName(
        question._id,
        store.activeUser?.userName,
      )
      setHasUserSubscribed(!hasUserSubscribed)
    }
    return null
  }

  return (
    <Box sx={{ p: 7 }}>
      {isLoading ? (
        <Loader />
      ) : question ? (
        <>
          <Card sx={{ mt: 4, p: 4, position: 'relative' }}>
            <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
              <UsefulStatsButton
                votedUsefulCount={store.votedUsefulCount}
                hasUserVotedUseful={store.userVotedActiveQuestionUseful}
                isLoggedIn={store.activeUser ? true : false}
                onUsefulClick={onUsefulClick}
              />
              <FollowButton
                hasUserSubscribed={hasUserSubscribed}
                isLoggedIn={isLoggedIn ? true : false}
                onFollowClick={onFollowClick}
              />
            </Flex>
            <ModerationStatus
              status={question.moderation}
              contentType="question"
              sx={{ top: 0, position: 'absolute', right: 0 }}
            />

            <ContentAuthorTimestamp
              userName={question._createdBy}
              countryCode={question.creatorCountry}
              created={question._created}
              modified={
                question._contentModifiedTimestamp || question._modified
              }
              action="Asked"
            />

            <Box mt={3} mb={2}>
              <Heading mb={1}>{question.title}</Heading>
              <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
                {question.description}
              </Text>

              {isEditable && (
                <Link to={'/questions/' + question.slug + '/edit'}>
                  <Button variant={'primary'}>Edit</Button>
                </Link>
              )}
            </Box>
          </Card>
          <QuestionComments comments={comments} />
        </>
      ) : null}
    </Box>
  )
}
