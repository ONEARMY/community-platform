import { useEffect, useMemo, useState } from 'react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import {
  Category,
  ContentStatistics,
  FollowButton,
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
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers'
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Text,
} from 'theme-ui'

import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase'
import { ContentAuthorTimestamp } from '../common/ContentAuthorTimestamp/ContentAuthorTimestamp'

import type { IUser, News } from 'oa-shared'

interface IProps {
  news: News
}

export const NewsPage = observer(({ news }: IProps) => {
  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser
  const [voted, setVoted] = useState<boolean>(false)
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(news.usefulCount)
  const [subscribersCount, setSubscribersCount] = useState<number>(
    news.subscriberCount,
  )

  useEffect(() => {
    const getSubscribed = async () => {
      const subscribed = await subscribersService.isSubscribed('news', news.id)
      setSubscribed(subscribed)
    }

    const getVoted = async () => {
      const voted = await usefulService.hasVoted('news', news.id)
      setVoted(voted)
    }

    if (activeUser) {
      getSubscribed()
      getVoted()
    }
  }, [activeUser, news])

  const isEditable = useMemo(() => {
    return (
      hasAdminRights(activeUser as IUser) ||
      news.author?.username === activeUser?.userName
    )
  }, [activeUser, news.author])

  const onUsefulClick = async (vote: 'add' | 'delete') => {
    if (!activeUser) {
      return
    }

    if (vote === 'add') {
      const response = await usefulService.add('news', news.id)

      if (response.ok) {
        setVoted(true)
        setUsefulCount((prev) => prev + 1 || 1)
      }
    } else {
      const response = await usefulService.remove('news', news.id)

      if (response.ok) {
        setVoted(false)
        setUsefulCount((prev) => prev - 1 || 0)
      }
    }

    trackEvent({
      category: 'NewsPage',
      action: vote === 'add' ? 'NewsUseful' : 'NewsUsefulRemoved',
      label: news.slug,
    })
  }

  const onFollowClick = async () => {
    if (!activeUser?._id) {
      return
    }

    if (!subscribed) {
      const response = await subscribersService.add('news', news.id)

      if (response.ok) {
        setSubscribed(true)
        setSubscribersCount((prev) => prev + 1 || 1)
      }
    } else {
      const response = await subscribersService.remove('news', news.id)

      if (response.ok) {
        setSubscribed(false)
        setSubscribersCount((prev) => prev - 1 || 0)
      }
    }
    const action = subscribed ? 'Unsubscribed' : 'Subscribed'

    trackEvent({
      category: 'News',
      action: action,
      label: news.slug,
    })
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      <Breadcrumbs content={news} variant="news" />
      <Flex sx={{ flexDirection: 'column', gap: 3 }}>
        {news.heroImage && (
          <AspectRatio ratio={2 / 1}>
            <Image
              src={news.heroImage.publicUrl}
              sx={{ borderRadius: 2, width: '100%' }}
            />
          </AspectRatio>
        )}

        <Flex sx={{ flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Heading as="h1" data-cy="news-title" data-testid="news-title">
            {news.title}
          </Heading>

          <ContentAuthorTimestamp
            userName={news.author?.username || ''}
            countryCode={news.author?.country || ''}
            created={news.createdAt}
            modified={news.modifiedAt || undefined}
            action="Published"
          />

          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            {news.category && <Category category={news.category} />}
            {news.tags && (
              <TagList
                data-cy="news-tags"
                tags={news.tags.map((t) => ({ label: t.name }))}
              />
            )}
          </Flex>

          <Text
            variant="paragraph"
            data-cy="news-description"
            sx={{ whiteSpace: 'pre-line', alignSelf: 'stretch' }}
          >
            <LinkifyText>{news.body}</LinkifyText>
          </Text>
        </Flex>
        <Flex
          sx={{ flexWrap: 'wrap', gap: 3, justifyContent: 'space-between' }}
        >
          <ClientOnly fallback={<></>}>
            {() => (
              <Flex sx={{ gap: 3 }}>
                <UsefulStatsButton
                  votedUsefulCount={usefulCount}
                  hasUserVotedUseful={voted}
                  isLoggedIn={!!activeUser}
                  onUsefulClick={() => onUsefulClick(voted ? 'delete' : 'add')}
                />
                <FollowButton
                  hasUserSubscribed={subscribed}
                  isLoggedIn={!!activeUser}
                  onFollowClick={onFollowClick}
                />
                {isEditable && (
                  <Link to={'/news/' + news.slug + '/edit'}>
                    <Button type="button" variant="primary" data-cy="edit">
                      Edit
                    </Button>
                  </Link>
                )}
              </Flex>
            )}
          </ClientOnly>

          <ContentStatistics
            statistics={[
              {
                icon: 'view',
                label: buildStatisticsLabel({
                  stat: news.totalViews,
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
        </Flex>
      </Flex>
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
              sourceId={news.id}
              authors={news.author?.id ? [news.author?.id] : []}
            />
          </Card>
        )}
      </ClientOnly>
    </Box>
  )
})
