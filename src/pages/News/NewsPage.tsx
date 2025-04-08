import { useMemo } from 'react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import {
  Category,
  ContentStatistics,
  DisplayMarkdown,
  TagList,
} from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers'
import { AspectRatio, Box, Button, Card, Flex, Heading, Image } from 'theme-ui'

import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase'
import { UserNameTag } from '../common/UserNameTag/UserNameTag'

import type { IUser, News } from 'oa-shared'

interface IProps {
  news: News
}

export const NewsPage = observer(({ news }: IProps) => {
  const { userStore } = useCommonStores().stores
  const activeUser = userStore.activeUser

  const isEditable = useMemo(() => {
    return (
      hasAdminRights(activeUser as IUser) ||
      news.author?.username === activeUser?.userName
    )
  }, [activeUser, news.author])

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

          <UserNameTag
            userName={news.author?.username || ''}
            countryCode={news.author?.country || ''}
            createdAt={news.createdAt}
            modifiedAt={news.modifiedAt}
            action="Published"
          />

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

          <DisplayMarkdown body={news.body} />

          <Flex
            sx={{
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'stretch',
              paddingY: 2,
            }}
          >
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
                  icon: 'comment',
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
            />
          </Card>
        )}
      </ClientOnly>
    </Box>
  )
})
