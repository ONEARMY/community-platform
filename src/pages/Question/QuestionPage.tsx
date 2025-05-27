import { useEffect, useMemo, useState } from 'react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import {
  Category,
  ContentStatistics,
  ImageGallery,
  LinkifyText,
  TagList,
  UsefulStatsButton,
} from 'oa-components'
import { type IUser, type Question, UserRole } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FollowButtonAction } from 'src/common/FollowButtonAction'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { usefulService } from 'src/services/usefulService'
import { formatImagesForGalleryV2 } from 'src/utils/formatImageListForGallery'
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers'
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase'
import { UserNameTag } from '../common/UserNameTag/UserNameTag'

interface IProps {
  question: Question
}

export const QuestionPage = observer(({ question }: IProps) => {
  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser
  const [voted, setVoted] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(question.usefulCount)
  const [subscribersCount, setSubscribersCount] = useState<number>(
    question.subscriberCount,
  )

  useEffect(() => {
    const getVoted = async () => {
      const voted = await usefulService.hasVoted('questions', question.id)
      setVoted(voted)
    }

    if (activeUser) {
      getVoted()
    }
  }, [activeUser, question])

  const isEditable = useMemo(() => {
    return (
      hasAdminRights(activeUser as IUser) ||
      question.author?.username === activeUser?.userName
    )
  }, [activeUser, question.author])

  const onUsefulClick = async (vote: 'add' | 'delete') => {
    if (!activeUser) {
      return
    }

    if (vote === 'add') {
      const response = await usefulService.add('questions', question.id)

      if (response.ok) {
        setVoted(true)
        setUsefulCount((prev) => prev + 1 || 1)
      }
    } else {
      const response = await usefulService.remove('questions', question.id)

      if (response.ok) {
        setVoted(false)
        setUsefulCount((prev) => prev - 1 || 0)
      }
    }

    trackEvent({
      category: 'QuestionPage',
      action: vote === 'add' ? 'QuestionUseful' : 'QuestionUsefulRemoved',
      label: question.slug,
    })
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      <Breadcrumbs content={question} variant="question" />
      <Card sx={{ position: 'relative' }} variant="responsive">
        <Flex sx={{ flexDirection: 'column', padding: [3, 4], gap: 3 }}>
          <Flex sx={{ flexWrap: 'wrap', gap: 3 }}>
            <ClientOnly fallback={<></>}>
              {() => (
                <>
                  <UsefulStatsButton
                    votedUsefulCount={usefulCount}
                    hasUserVotedUseful={voted}
                    isLoggedIn={!!activeUser}
                    onUsefulClick={() =>
                      onUsefulClick(voted ? 'delete' : 'add')
                    }
                  />
                  {isEditable && (
                    <Link to={'/questions/' + question.slug + '/edit'}>
                      <Button type="button" variant="primary" data-cy="edit">
                        Edit
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </ClientOnly>
          </Flex>

          <UserNameTag
            userName={question.author?.username || ''}
            countryCode={question.author?.country || ''}
            createdAt={question.createdAt}
            modifiedAt={question.modifiedAt}
            action="Asked"
          />

          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            {question.category && <Category category={question.category} />}
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
                images={formatImagesForGalleryV2(question.images) as any}
                allowPortrait={true}
              />
            )}

            {question.tags && (
              <TagList
                data-cy="question-tags"
                tags={question.tags.map((t) => ({ label: t.name }))}
              />
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
                stat: question.totalViews,
                statUnit: 'view',
                usePlural: true,
              }),
            },
            {
              icon: 'thunderbolt-grey',
              label: buildStatisticsLabel({
                stat: subscribersCount,
                statUnit: 'following',
                usePlural: false,
              }),
            },
            {
              icon: 'star',
              label: buildStatisticsLabel({
                stat: usefulCount,
                statUnit: 'useful',
                usePlural: false,
              }),
            },
            {
              icon: 'comment',
              label: buildStatisticsLabel({
                stat: question.commentCount,
                statUnit: 'comment',
                usePlural: true,
              }),
            },
          ]}
        />
      </Card>
      <ClientOnly fallback={<></>}>
        {() => (
          <Card
            variant="responsive"
            sx={{
              background: 'softblue',
              borderTop: 0,
              padding: [3, 4],
              marginTop: [0, 2, 4],
            }}
          >
            <CommentSectionSupabase
              authors={question.author?.id ? [question.author?.id] : []}
              sourceId={question.id}
              sourceType="questions"
              followButton={
                <AuthWrapper roleRequired={UserRole.BETA_TESTER}>
                  <FollowButtonAction
                    labelFollow="Follow Comments"
                    labelUnfollow="Following Comments"
                    contentType="questions"
                    item={question}
                    setSubscribersCount={setSubscribersCount}
                  />
                </AuthWrapper>
              }
            />
          </Card>
        )}
      </ClientOnly>
    </Box>
  )
})
