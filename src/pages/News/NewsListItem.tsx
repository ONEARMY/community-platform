import {
  Category,
  Icon,
  IconCountWithTooltip,
  InternalLink,
  // ModerationStatus,
} from 'oa-components'
import { Highlighter } from 'src/common/Highlighter'
import { AspectRatio, Button, Card, Flex, Heading, Image, Text } from 'theme-ui'

import { UserNameTag } from '../common/UserNameTag/UserNameTag'
import { listing } from './labels'

import type { News } from 'oa-shared'

interface IProps {
  news: News
  query?: string
}

export const NewsListItem = ({ news, query }: IProps) => {
  const url = `/news/${encodeURIComponent(news.slug)}`
  const searchWords = [query || '']

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
        {news.heroImage && (
          <InternalLink to={url}>
            <AspectRatio ratio={2 / 1}>
              <Image src={news.heroImage.publicUrl} sx={{ width: '100%' }} />{' '}
            </AspectRatio>
          </InternalLink>
        )}

        <Flex
          sx={{
            flexDirection: 'column',
            padding: 4,
          }}
        >
          <Flex sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Heading
              as="h2"
              data-cy="news-list-item-title"
              sx={{
                color: 'black',
                fontSize: [3, 3, 4],
                marginBottom: 0.5,
              }}
            >
              <Highlighter
                searchWords={searchWords}
                textToHighlight={news.title}
              />
            </Heading>

            {news.category && (
              <Category category={news.category} sx={{ fontSize: 2 }} />
            )}
          </Flex>

          <UserNameTag
            countryCode={news.author?.country || ''}
            createdAt={news.createdAt}
            modifiedAt={news.modifiedAt}
            userName={news.author?.username || ''}
          />

          {news.summary && (
            <Text
              data-cy="news-list-item-summary"
              sx={{ paddingY: 2, fontSize: 2 }}
            >
              <Highlighter
                searchWords={searchWords}
                textToHighlight={news.summary}
              />
            </Text>
          )}

          <Flex sx={{ justifyContent: 'space-between' }}>
            <InternalLink to={url}>
              <Button variant="subtle" sx={{ gap: 2 }}>
                Read more <Icon glyph="arrow-forward" />
              </Button>
            </InternalLink>

            <IconCountWithTooltip
              count={(news as any).commentCount || 0}
              icon="comment"
              text={listing.totalComments}
            />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}
