import {
  Button,
  Category,
  ProfileBadgeContentLabel,
  // ModerationStatus,
} from 'oa-components';
import type { News } from 'oa-shared';
import { Link } from 'react-router';
import { Highlighter } from 'src/common/Highlighter';
import { AspectRatio, Card, Flex, Heading, Image, Text } from 'theme-ui';
import { DisplayDate } from '@/components/ui/display-date';
import { NewsLockedImage } from './NewsLockedImage';

interface IProps {
  news: News;
  query?: string;
}

export const NewsListItem = ({ news, query }: IProps) => {
  const url = `/news/${encodeURIComponent(news.slug)}`;
  const searchWords = [query || ''];

  return (
    <Card
      as="li"
      data-cy="news-list-item"
      data-id={news.id}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {news.heroImage && news.isLocked && (
          <Link to={url}>
            <NewsLockedImage news={news} />
          </Link>
        )}

        {news.heroImage && !news.isLocked && (
          <Link to={url}>
            <AspectRatio ratio={2 / 1}>
              <Image
                src={news.heroImage.publicUrl}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AspectRatio>
          </Link>
        )}

        <Flex
          sx={{
            flexDirection: 'column',
            padding: 4,
          }}
        >
          <Flex sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to={url}>
              <Heading
                as="h2"
                data-cy="news-list-item-title"
                sx={{
                  color: 'black',
                  fontSize: [3, 3, 4],
                  marginBottom: 0.5,
                }}
              >
                <Highlighter searchWords={searchWords} textToHighlight={news.title} />
              </Heading>
            </Link>

            {news.category && <Category category={news.category} sx={{ fontSize: 2 }} />}
            {news.profileBadges?.map((badge) => (
              <ProfileBadgeContentLabel key={badge.id} profileBadge={badge} />
            ))}
          </Flex>

          <Text variant="auxiliary">
            {/* Intentionally not passing modifiedAt, news edits are often minor fixes */}
            <DisplayDate
              createdAt={news.createdAt}
              publishedAt={news.publishedAt}
              publishedAction="Published"
            />
          </Text>

          {news.summary && (
            <Text
              data-cy="news-list-item-summary"
              sx={{
                paddingY: 2,
                fontSize: 2,
                color: 'grey',
                lineHeight: 2,
              }}
            >
              <Highlighter searchWords={searchWords} textToHighlight={news.summary} />
            </Text>
          )}

          <Flex>
            <Link to={url}>
              <Button data-cy="news-list-item-button" variant="outline" small>
                Read more
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
