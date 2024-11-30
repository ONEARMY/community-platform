import { useEffect, useState } from 'react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import {
  Category,
  ContentStatistics,
  FollowButton,
  ImageGallery,
  LinkifyText,
  ModerationStatus,
  UsefulStatsButton,
} from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { TagList } from 'src/common/Tags/TagsList'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { buildStatisticsLabel, isAllowedToEditContent } from 'src/utils/helpers'
import { Box, Button, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import CommentSectionV2 from '../common/CommentsV2/CommentSectionV2'
import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'

import type { IQuestionDB } from 'oa-shared'

type QuestionPageProps = {
  question: IQuestionDB
}

export const QuestionPage = observer(({ question }: QuestionPageProps) => {
  const store = useQuestionStore()
  const activeUser = store.activeUser
  const [voted, setVoted] = useState<boolean>(false)
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(
    question.votedUsefulBy?.length || 0,
  )
  const [subscribersCount, setSubscribersCount] = useState<number>(
    question.subscribers?.length || 0,
  )
  const isEditable =
    !!activeUser && isAllowedToEditContent(question, activeUser)

  useEffect(() => {
    // This could be improved if we can load the user profile server-side
    if (!store?.activeUser) {
      return
    }

    if (
      store?.activeUser &&
      question.votedUsefulBy?.includes(store.activeUser._id)
    ) {
      setVoted(true)
    }

    if (question.subscribers?.includes(store.activeUser._id)) {
      setSubscribed(true)
    }
  }, [store?.activeUser])

  const onUsefulClick = async (vote: 'add' | 'delete') => {
    if (!activeUser) {
      return
    }

    await store.toggleUsefulByUser(question._id, activeUser?.userName)
    setVoted((prev) => !prev)

    setUsefulCount((prev) => {
      return vote === 'add' ? prev + 1 : prev - 1
    })

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

    await store.toggleSubscriber(question._id, activeUser._id)
    const action = subscribed ? 'Unsubscribed' : 'Subscribed'

    setSubscribersCount((prev) => prev + (subscribed ? -1 : 1))
    // toggle subscribed
    setSubscribed((prev) => !prev)

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

          <ModerationStatus
            status={question.moderation}
            contentType="question"
            sx={{ top: 0, position: 'absolute', right: 0 }}
          />

          <ContentAuthorTimestamp
            userName={question._createdBy}
            countryCode={question.creatorCountry}
            created={question._created}
            modified={question._contentModifiedTimestamp || question._modified}
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
            <CommentSectionV2 sourceId={question._id} />
          </Card>
        )}
      </ClientOnly>
    </Box>
  )
})
