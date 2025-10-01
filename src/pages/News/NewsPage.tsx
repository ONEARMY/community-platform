import { useMemo, useState } from 'react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import {
  Category,
  ContentStatistics,
  DisplayDate,
  DisplayMarkdownStylingWrapper,
  ProfileBadgeContentLabel,
  TagList,
} from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { useProfileStore } from 'src/stores/Profile/profile.store'
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
import { DraftTag } from '../common/Drafts/DraftTag'

import type { News } from 'oa-shared'

interface IProps {
  news: News
}

export const NewsPage = observer(({ news }: IProps) => {
  const [subscribersCount, setSubscribersCount] = useState<number>(
    news.subscriberCount,
  )

  const { profile } = useProfileStore()

  const isEditable = useMemo(() => {
    return (
      hasAdminRights(profile) || news.author?.username === profile?.username
    )
  }, [profile, news.author])

  return (
    <Box sx={{ width: '100%', maxWidth: '620px', alignSelf: 'center' }}>
      <Breadcrumbs content={news} variant="news" />
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        {news.heroImage && (
          <AspectRatio ratio={2 / 1}>
            <Image
              src={news.heroImage.publicUrl}
              sx={{ borderRadius: 2, width: '100%' }}
            />
          </AspectRatio>
        )}

        <Flex
          sx={{
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
            padding: [2, 0],
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            {news.category && <Category category={news.category} />}
            {news.profileBadge && (
              <ProfileBadgeContentLabel profileBadge={news.profileBadge} />
            )}
            {news.tags && (
              <TagList
                data-cy="news-tags"
                tags={news.tags.map((t) => ({ label: t.name }))}
              />
            )}
          </Flex>

          <Heading
            as="h1"
            data-cy="news-title"
            data-testid="news-title"
            sx={{ textAlign: 'center' }}
          >
            {news.title}
          </Heading>

          <Text variant="auxiliary">
            <DisplayDate action={'Published'} createdAt={news.createdAt} />
          </Text>

          {news.isDraft && <DraftTag />}

          {isEditable && (
            <ClientOnly fallback={<></>}>
              {() => (
                <Link to={'/news/' + news.slug + '/edit'}>
                  <Button type="button" variant="primary" data-cy="edit">
                    Edit
                  </Button>
                </Link>
              )}
            </ClientOnly>
          )}

          <DisplayMarkdownStylingWrapper
            sx={{
              img: {
                borderRadius: 2,
                maxWidth: ['105%', '105%', '120%'],
                marginLeft: ['-2.5%', '-2.5%', '-10%'],
              },
              iframe: {
                maxWidth: ['105%', '105%', '120%'],
                maxHeight: ['300px', '370px', '420px'],
                marginLeft: ['-2.5%', '-2.5%', '-10%'],
              },
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: news.bodyHtml }} />
          </DisplayMarkdownStylingWrapper>

          <Flex
            sx={{
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'stretch',
              paddingTop: 2,
              paddingBottom: 2,
            }}
          >
            <ContentStatistics
              statistics={[
                {
                  icon: 'show',
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
                  icon: 'comment-outline',
                  label: buildStatisticsLabel({
                    stat: news.commentCount,
                    statUnit: 'comment',
                    usePlural: true,
                  }),
                },
              ]}
              alwaysShow
            />
          </Flex>
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
            }}
          >
            <CommentSectionSupabase
              authors={news.author?.id ? [news.author?.id] : []}
              sourceId={news.id}
              sourceType="news"
              setSubscribersCount={setSubscribersCount}
            />
          </Card>
        )}
      </ClientOnly>
    </Box>
  )
})
