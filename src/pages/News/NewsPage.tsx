import { observer } from 'mobx-react';
import { Category, ContentImageLightbox, ContentStatistics, DisplayDate, ProfileBadgeContentLabel, TagList } from 'oa-components';
import type { News } from 'oa-shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import PageHeader from 'src/common/PageHeader';
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers';
import { AspectRatio, Box, Button, Card, Flex, Heading, Image, Text } from 'theme-ui';
import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase';
import { DraftTag } from '../common/Drafts/DraftTag';

interface IProps {
  news: News;
}

export const NewsPage = observer(({ news }: IProps) => {
  const [subscribersCount, setSubscribersCount] = useState<number>(news.subscriberCount);
  const [heroImage, setHeroImage] = useState<HTMLImageElement | null>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (heroImageRef.current && !heroImage) {
      // need state to trigger re-render of ContentImageLightbox because ref doesn't trigger re-render
      setHeroImage(heroImageRef.current);
    }
  }, []);

  const { profile } = useProfileStore();

  const isEditable = useMemo(() => {
    return hasAdminRights(profile) || news.author?.username === profile?.username;
  }, [profile, news.author]);

  const prependImages = useMemo(() => {
    return heroImage ? [heroImage] : [];
  }, [heroImage]);

  return (
    <Box sx={{ width: '100%', maxWidth: '620px', alignSelf: 'center' }}>
      <PageHeader>
        <Breadcrumbs steps={[{ text: 'News', link: '/news' }, { text: news.title }]} />
      </PageHeader>

      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        {news.heroImage && (
          <AspectRatio ratio={2 / 1}>
            <Image ref={heroImageRef} src={news.heroImage.publicUrl} sx={{ borderRadius: 2, width: '100%', cursor: 'pointer' }} />
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
            {news.profileBadge && <ProfileBadgeContentLabel profileBadge={news.profileBadge} />}
            {news.tags && <TagList data-cy="news-tags" tags={news.tags.map((t) => ({ label: t.name }))} />}
          </Flex>

          <Heading as="h1" data-cy="news-title" data-testid="news-title" sx={{ textAlign: 'center' }}>
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

          <Box
            data-cy="news-body"
            sx={{
              alignSelf: 'stretch',
              fontFamily: 'body',
              lineHeight: 1.5,
              a: {
                textDecoration: 'underline',
                '&:hover': { textDecoration: 'none' },
              },
              h3: { fontSize: 2 },
              h4: { fontSize: 2 },
              h5: { fontSize: 2 },
              h6: { fontSize: 2 },
              img: {
                borderRadius: 2,
                maxWidth: '100%',
              },
              iframe: {
                maxHeight: ['300px', '370px', '420px'],
              },
            }}
          >
            <ContentImageLightbox prependImages={prependImages}>
              <div dangerouslySetInnerHTML={{ __html: news.bodyHtml }} />
            </ContentImageLightbox>
          </Box>

          <Flex
            sx={{
              flexWrap: 'wrap',
              gap: 3,
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
                  stat: news.totalViews,
                },
                {
                  icon: 'thunderbolt-grey',
                  label: buildStatisticsLabel({
                    stat: subscribersCount,
                    statUnit: 'following',
                    usePlural: false,
                  }),
                  stat: subscribersCount,
                },
                {
                  icon: 'comment-outline',
                  label: buildStatisticsLabel({
                    stat: news.commentCount,
                    statUnit: 'comment',
                    usePlural: true,
                  }),
                  stat: news.commentCount,
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
  );
});
