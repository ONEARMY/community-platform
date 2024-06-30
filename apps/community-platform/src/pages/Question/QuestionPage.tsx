import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Category,
  ContentStatistics,
  FollowButton,
  ImageGallery,
  LinkifyText,
  Loader,
  ModerationStatus,
  UsefulStatsButton,
} from '@onearmy.apps/components'
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { TagList } from '../../common/Tags/TagsList'
import { Breadcrumbs } from '../../pages/common/Breadcrumbs/Breadcrumbs'
import { useQuestionStore } from '../../stores/Question/question.store'
import { formatImagesForGallery } from '../../utils/formatImageListForGallery'
import { buildStatisticsLabel } from '../../utils/helpers'
import { incrementViewCount } from '../../utils/incrementViewCount'
import { seoTagsUpdate } from '../../utils/seo'
import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'
import { QuestionDiscussion } from './QuestionDiscussion'

import type { IQuestionItem } from '../../models'
import type { IUploadedFileMeta } from '../../stores/storage'

export const QuestionPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<IQuestionItem | undefined>()
  const [totalCommentsCount, setTotalCommentsCount] = useState(0)

  const { slug } = useParams()
  const navigate = useNavigate()
  const store = useQuestionStore()
  const activeUser = store.activeUser

  useEffect(() => {
    const fetchQuestion = async () => {
      const foundQuestion: IQuestionItem | null =
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
      incrementViewCount({
        document: foundQuestion,
        documentType: 'question',
        store,
      })

      setQuestion(foundQuestion)
      setTotalCommentsCount(foundQuestion.commentCount || totalCommentsCount)
      setIsLoading(false)

      const imageUrl =
        (foundQuestion.images &&
          (foundQuestion.images[0] as IUploadedFileMeta).downloadUrl) ||
        undefined

      seoTagsUpdate({
        title: `${foundQuestion.title} - Question`,
        description: foundQuestion.description,
        imageUrl,
      })
    }

    fetchQuestion()

    return () => {
      setIsLoading(true)
    }
  }, [])

  const onUsefulClick = async () => {
    const updatedQuestion = (await store.toggleUsefulByUser()) as IQuestionItem
    setQuestion(updatedQuestion)
  }

  const onFollowClick = async () => {
    const updatedQuestion = await store.toggleSubscriberStatusByUserName()
    setQuestion(updatedQuestion)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      {isLoading ? (
        <Loader />
      ) : question ? (
        <>
          <Breadcrumbs content={question} variant="question" />
          <Card sx={{ position: 'relative' }}>
            <Flex sx={{ flexDirection: 'column', padding: 4, gap: 2 }}>
              <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
                <UsefulStatsButton
                  votedUsefulCount={store.votedUsefulCount}
                  hasUserVotedUseful={store.userVotedActiveQuestionUseful}
                  isLoggedIn={!!activeUser}
                  onUsefulClick={onUsefulClick}
                />
                <FollowButton
                  hasUserSubscribed={store.userHasSubscribed}
                  isLoggedIn={!!activeUser}
                  onFollowClick={onFollowClick}
                />
                {store.userCanEditQuestion && (
                  <Link to={'/questions/' + question.slug + '/edit'}>
                    <Button variant={'primary'} data-cy="edit">
                      Edit
                    </Button>
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
                <Heading
                  as="h1"
                  data-cy="question-title"
                  data-testid="question-title"
                >
                  {question.title}
                </Heading>

                <Text
                  variant="paragraph"
                  data-cy="question-description"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  <LinkifyText>{question.description}</LinkifyText>
                </Text>

                {question.images && (
                  <ImageGallery
                    images={formatImagesForGallery(question.images) as any}
                    allowPortrait={true}
                  />
                )}

                {question.tags && (
                  <TagList data-cy="question-tags" tags={question.tags} />
                )}
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
                    stat: question.total_views,
                    statUnit: 'view',
                    usePlural: true,
                  }),
                },
                {
                  icon: 'thunderbolt',
                  label: buildStatisticsLabel({
                    stat: store.subscriberCount,
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
