import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  DiscussionContainer,
  FollowButton,
  Loader,
  ModerationStatus,
  UsefulStatsButton,
} from 'oa-components'
import { trackEvent } from 'src/common/Analytics'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { discussionsService } from 'src/services/discussions.service'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Box, Button, Card, Flex, Heading, Text } from 'theme-ui'

import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'

import type { IDiscussion, IQuestion } from 'src/models'

export const QuestionPage = () => {
  const { slug } = useParams()
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<IQuestion.Item | undefined>()
  const [isEditable, setIsEditable] = useState(false)
  const [hasUserSubscribed, setHasUserSubscribed] = useState(false)
  const [discussion, setDiscussion] = useState<IDiscussion | null>(null)
  const [comment, setComment] = useState('')
  const highlightedCommentId = window.location.hash.replace('#comment:', '')
  const category = 'Comments'
  const label = store.activeQuestionItem?.title

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
        if (foundQuestion) {
          try {
            const discussion =
              await discussionsService.fetchOrCreateDiscussionBySource(
                foundQuestion._id,
                'question',
              )
            if (discussion) {
              setDiscussion(discussion)
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

  const onSubmit = async (comment: string) => {
    try {
      // const question = store.activeQuestionItem
      const updatedDiscussion = await discussionsService.addComment(
        discussion!,
        comment,
        store.activeUser!,
      )
      // if (question) {
      //   await stores.userNotificationsStore.triggerNotification(
      //     'new_comment',
      //     question._createdBy,
      //     '/how-to/' + question.slug,
      //   )
      // }

      setComment('')
      if (updatedDiscussion) {
        setDiscussion(updatedDiscussion)
      }

      const action = 'Submitted'
      trackEvent({ action, category, label })
      logger.debug({ action, category, label }, 'comment submitted')
    } catch (err) {
      logger.error('Failed to submit comment', { err })
    }
  }

  const handleEditRequest = async () => {
    const action = 'Edit existing comment'
    trackEvent({ action, category, label })
  }

  const handleDelete = async (_id: string) => {
    await discussionsService.deleteComment(discussion!, _id, store.activeUser!)

    const action = 'Deleted'
    trackEvent({ action, category, label })
    logger.debug({ action, category, label }, 'comment deleted')
  }

  const handleEdit = async (_id: string, comment: string) => {
    await discussionsService.editComment(
      discussion!,
      _id,
      comment,
      store.activeUser!,
    )

    const action = 'Update'
    trackEvent({ action, category, label })
    logger.debug({ action, category, label }, 'comment edited')
  }

  const onMoreComments = () => {
    const action = 'Show more'
    trackEvent({ action, category, label })
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
          <DiscussionContainer
            comments={discussion!.comments as any}
            handleEdit={handleEdit}
            handleEditRequest={handleEditRequest}
            handleDelete={handleDelete}
            highlightedCommentId={highlightedCommentId}
            maxLength={MAX_COMMENT_LENGTH}
            comment={comment}
            onChange={setComment}
            onMoreComments={onMoreComments}
            onSubmit={onSubmit}
            isLoggedIn={isLoggedIn}
          />
        </>
      ) : null}
    </Box>
  )
}
