import { useEffect, useMemo, useState } from 'react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import {
  Category,
  ContentStatistics,
  FollowButton,
  ImageGallery,
  LinkifyText,
  TagList,
  UsefulStatsButton,
} from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { subscribersService } from 'src/services/subscribersService'
import { usefulService } from 'src/services/usefulService'
import { formatImagesForGalleryV2 } from 'src/utils/formatImageListForGallery'
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers'
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase'
import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'

import type { IUser } from 'oa-shared'
import type { Question } from 'src/models/question.model'

type QuestionPageProps = {
  question: Question
}

export const QuestionPage = observer(({ question }: QuestionPageProps) => {
  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser
  const [voted, setVoted] = useState<boolean>(false)
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(question.usefulCount)
  const [subscribersCount, setSubscribersCount] = useState<number>(
    question.subscriberCount,
  )

  useEffect(() => {
    const getSubscribed = async () => {
      const subscribed = await subscribersService.isSubscribed(
        'questions',
        question.id,
      )
      setSubscribed(subscribed)
    }

    const getVoted = async () => {
      const voted = await usefulService.hasVoted('questions', question.id)
      setVoted(voted)
    }

    if (activeUser) {
      getSubscribed()
      getVoted()
    }
  }, [activeUser, question])

  const isEditable = useMemo(() => {
    return (
      hasAdminRights(activeUser as IUser) ||
      (question.author?.firebaseAuthId &&
        question.author?.firebaseAuthId === activeUser?._authID)
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

  const onFollowClick = async () => {
    if (!activeUser?._id) {
      return
    }

    if (!subscribed) {
      const response = await subscribersService.add('questions', question.id)

      if (response.ok) {
        setSubscribed(true)
        setSubscribersCount((prev) => prev + 1 || 1)
      }
    } else {
      const response = await subscribersService.remove('questions', question.id)

      if (response.ok) {
        setSubscribed(false)
        setSubscribersCount((prev) => prev - 1 || 0)
      }
    }
    const action = subscribed ? 'Unsubscribed' : 'Subscribed'

    trackEvent({
      category: 'Question',
      action: action,
      label: question.slug,
    })
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      <Breadcrumbs content={question} variant="question" />
      <Card sx={{ position: 'relative' }}>
        <Flex sx={{ flexDirection: 'column', padding: 4, gap: 2 }}>
          <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
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
                  <FollowButton
                    hasUserSubscribed={subscribed}
                    isLoggedIn={!!activeUser}
                    onFollowClick={onFollowClick}
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

          <ContentAuthorTimestamp
            userName={question.author?.username || ''}
            countryCode={question.author?.country || ''}
            created={question.createdAt}
            modified={question.modifiedAt || undefined}
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
          ]}
        />
      </Card>
      <ClientOnly fallback={<></>}>
        {() => (
          <Card
            sx={{
              marginTop: 5,
              padding: 4,
            }}
          >
            <CommentSectionSupabase
              sourceId={question.id}
              authors={question.author?.id ? [question.author?.id] : []}
            />
          </Card>
        )}
      </ClientOnly>
    </Box>
  )
})
