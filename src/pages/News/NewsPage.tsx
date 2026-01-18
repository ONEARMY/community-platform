import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import {
  Category,
  ContentStatistics,
  DisplayDate,
  ProfileBadgeContentLabel,
  TagList,
} from 'oa-components';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only';
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { buildStatisticsLabel, hasAdminRights } from 'src/utils/helpers';
import { AspectRatio, Box, Button, Card, Flex, Heading, Image, Text } from 'theme-ui';

import { CommentSectionSupabase } from '../common/CommentsSupabase/CommentSectionSupabase';
import { DraftTag } from '../common/Drafts/DraftTag';

import type { News } from 'oa-shared';

interface IProps {
  news: News;
}

export const NewsPage = observer(({ news }: IProps) => {
  const [subscribersCount, setSubscribersCount] = useState<number>(news.subscriberCount);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const { profile } = useProfileStore();

  const isEditable = useMemo(() => {
    return hasAdminRights(profile) || news.author?.username === profile?.username;
  }, [profile, news.author]);

  useEffect(() => {
    if (!contentRef.current) return;

    // 1. Find all images in the content body
    const images = contentRef.current.querySelectorAll('img');
    const imageElements = Array.from(images);

    // Add hero image if it exists
    if (heroImageRef.current) {
      imageElements.unshift(heroImageRef.current as HTMLImageElement);
    }

    if (imageElements.length === 0) {
      return;
    }

    // 2. Prepare data source for PhotoSwipe
    const dataSource = imageElements.map((img) => ({
      src: img.src,
      width: img.naturalWidth || 800, // Fallback if not loaded yet
      height: img.naturalHeight || 600,
      alt: img.alt,
    }));

    // 3. Initialize Lightbox
    const lightbox = new PhotoSwipeLightbox({
      dataSource,
      pswpModule: () => import('photoswipe'),
      paddingFn: () => {
        return {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        };
      },
    });

    // 4. Update dimensions when image loads (crucial for accurate zooming)
    lightbox.on('beforeOpen', () => {
      const pswp = lightbox.pswp;
      imageElements.forEach((img, index) => {
        const data: any = dataSource[index];
        data.width = img.naturalWidth;
        data.height = img.naturalHeight;
        pswp?.refreshSlideContent(index);
      });
    });

    lightbox.init();

    // 5. Attach click listeners to HTML images
    imageElements.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.onclick = (e) => {
        e.preventDefault();
        lightbox.loadAndOpen(index);
      };
    });

    return () => {
      lightbox.destroy();
      imageElements.forEach((img) => {
        img.onclick = null;
      });
    };
  }, [news.bodyHtml]);

  return (
    <Box sx={{ width: '100%', maxWidth: '620px', alignSelf: 'center' }}>
      <Breadcrumbs content={news} variant="news" />

      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        {news.heroImage && (
          <AspectRatio ratio={2 / 1}>
            <Image
              ref={heroImageRef}
              src={news.heroImage.publicUrl}
              sx={{ borderRadius: 2, width: '100%', cursor: 'pointer' }}
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
            {news.profileBadge && <ProfileBadgeContentLabel profileBadge={news.profileBadge} />}
            {news.tags && (
              <TagList data-cy="news-tags" tags={news.tags.map((t) => ({ label: t.name }))} />
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

          <Box
            ref={contentRef}
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
                marginLeft: 0,
              },
              iframe: {
                maxWidth: '100%',
                maxHeight: ['300px', '370px', '420px'],
                marginLeft: 0,
              },
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: news.bodyHtml }} />
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
