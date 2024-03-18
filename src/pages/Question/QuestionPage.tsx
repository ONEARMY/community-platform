import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Category,
  ContentStatistics,
  FollowButton,
  Loader,
  ModerationStatus,
  UsefulStatsButton,
} from 'oa-components'
import { TagList } from 'src/common/Tags/TagsList'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { buildStatisticsLabel, isAllowedToEditContent } from 'src/utils/helpers'
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'
import { QuestionDiscussion } from './QuestionDiscussion'

import type { IQuestion } from 'src/models'

export const QuestionPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<IQuestion.Item | undefined>()
  const [isEditable, setIsEditable] = useState(false)
  const [totalCommentsCount, setTotalCommentsCount] = useState(0)
  const [hasUserSubscribed, setHasUserSubscribed] = useState<boolean>(false)

  const { slug } = useParams()
  const navigate = useNavigate()
  const store = useQuestionStore()
  const activeUser = store.activeUser

  useEffect(() => {
    const fetchQuestion = async () => {
      const foundQuestion: IQuestion.Item | null =
        await store.fetchQuestionBySlug(slug || '')

      if (!foundQuestion) {
        const path = {
          pathname: `/question/`,
          search:
            '?search=' +
            (slug || '').replace(/-/gi, ' ') +
            '&source=question-not-found',
        }
        return navigate(path)
      }

      store.activeQuestionItem = foundQuestion
      store.incrementViewCount(foundQuestion._id)
      setQuestion(foundQuestion)
      setIsEditable(isAllowedToEditContent(foundQuestion, activeUser))
      if (
        activeUser?.userName &&
        foundQuestion.subscribers?.includes(activeUser?.userName)
      ) {
        setHasUserSubscribed(true)
      }

      setIsLoading(false)
    }

    fetchQuestion()

    return () => {
      setIsLoading(true)
    }
  }, [slug])

  const onUsefulClick = async () => {
    if (activeUser?.userName) {
      return null
    }

    // Trigger update without waiting
    const questionId = store.activeQuestionItem?._id
    if (questionId && activeUser) {
      store.toggleUsefulByUser(questionId, activeUser.userName)
      setQuestion(store.activeQuestionItem)
    }
  }

  const onFollowClick = () => {
    if (question) {
      store.toggleSubscriberStatusByUserName(question._id, activeUser?.userName)
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
          <Card sx={{ position: 'relative', marginTop: 4 }}>
            <Flex sx={{ flexDirection: 'column', padding: 4, gap: 2 }}>
              <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
                <UsefulStatsButton
                  votedUsefulCount={store.votedUsefulCount}
                  hasUserVotedUseful={store.userVotedActiveQuestionUseful}
                  isLoggedIn={!!activeUser}
                  onUsefulClick={onUsefulClick}
                />
                <FollowButton
                  hasUserSubscribed={hasUserSubscribed}
                  isLoggedIn={!!activeUser}
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

              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                {question.questionCategory && (
                  <Category category={question.questionCategory} />
                )}
                <Heading>{question.title}</Heading>

                <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
                  {question.description}
                </Text>

                {question.tags && <TagList tags={question.tags} />}
              </Flex>
            </Flex>

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
                    stat: totalCommentsCount,
                    statUnit: 'comment',
                    usePlural: true,
                  }),
                },
              ]}
            />
          </Card>
          {question._id && (
            <QuestionDiscussion
              questionDocId={question._id}
              setTotalCommentsCount={setTotalCommentsCount}
            />
          )}
        </>
      ) : null}
    </Box>
  )
}
