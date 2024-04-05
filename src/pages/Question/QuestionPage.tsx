import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Breadcrumbs,
  ContentStatistics,
  FollowButton,
  Loader,
  ModerationStatus,
  UsefulStatsButton} from 'oa-components'
import { transformToUserComments } from 'src/common/transformToUserComments'
import { logger } from 'src/logger'
import { useDiscussionStore } from 'src/stores/Discussions/discussions.store'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { buildStatisticsLabel, isAllowedToEditContent } from 'src/utils/helpers'
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'
import { QuestionComments } from './QuestionComments'

import type { IDiscussionComment, IQuestion } from 'src/models'

export const QuestionPage = () => {
  const { slug } = useParams()
  const store = useQuestionStore()
  const discussionStore = useDiscussionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<IQuestion.Item | undefined>()
  const [discussion, setDiscussion] = useState<IDiscussion.Item | undefined>(
    undefined,
  )
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

          logger.info(
            'Setting isEditable',
            isAllowedToEditContent(foundQuestion),
            store.activeUser,
          )
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
              setDiscussion(discussion)
              setComments(
                transformToUserComments(discussion.comments, store.activeUser),
              )
            }

            store.incrementViewCount(foundQuestion._id)
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
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      {isLoading ? (
        <Loader />
      ) : question ? (
        <>
          <Breadcrumbs
            steps={[
              {
                text: 'Question',
                link: '/questions',
              },
              question.questionCategory
                ? {
                    text: question.questionCategory.label,
                    link: `/questions?category=${question.questionCategory.label}`,
                  }
                : null,
              {
                text: question.title,
              },
            ]}
          />
          <Card sx={{ position: 'relative', mt: 4 }}>
            <Box sx={{ p: 4 }}>
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
                {isEditable && (
                  <Link to={'/questions/' + question.slug + '/edit'}>
                    <Button variant={'primary'}>Edit</Button>
                  </Link>
                )}
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
              </Box>
            </Box>

            <Divider
              sx={{
                m: 0,
                border: '.5px solid black',
              }}
            />
            <ContentStatistics
              statistics={[
                {
                  icon: 'view',
                  label: buildStatisticsLabel({
                    stat: question.total_views || 0,
                    statUnit: 'view',
                    usePlural: true,
                  }),
                },
                {
                  icon: 'thunderbolt',
                  label: buildStatisticsLabel({
                    stat: question?.subscribers?.length || 0,
                    statUnit: 'following',
                    usePlural: false,
                  }),
                },
                {
                  icon: 'star',
                  label: buildStatisticsLabel({
                    stat: store.votedUsefulCount,
                    statUnit: 'useful',
                    usePlural: false,
                  }),
                },
                {
                  icon: 'comment',
                  label: buildStatisticsLabel({
                    stat: comments.length,
                    statUnit: 'comment',
                    usePlural: true,
                  }),
                },
              ]}
            />
          </Card>
          {question._id && (
            <QuestionComments
              questionDocId={question._id}
              comments={comments}
              activeUser={store.activeUser}
              commentsUpdated={setComments}
              onSubmit={async (comment: string) => {
                if (!comment) {
                  return
                }

                // Trigger update without waiting
                const res = await discussionStore.addComment(
                  discussion,
                  comment,
                )

                setDiscussion(res)
                setComments(
                  transformToUserComments(
                    res?.comments || [],
                    store.activeUser,
                  ),
                )
              }}
            />
          )}
        </>
      ) : null}
    </Box>
  )
}
