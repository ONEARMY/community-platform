import {
  Category,
  IconCountWithTooltip,
  InternalLink,
  // ModerationStatus,
} from 'oa-components'
import { Highlighter } from 'src/common/Highlighter'
import { AspectRatio, Box, Button, Card, Flex, Heading, Image } from 'theme-ui'

import { UserNameTag } from '../common/UserNameTag/UserNameTag'
import { listing } from './labels'

import type { News } from 'oa-shared'

interface IProps {
  news: News
  query?: string
}

export const NewsListItem = ({ news, query }: IProps) => {
  const { body, id, heroImage } = news
  const url = `/news/${encodeURIComponent(news.slug)}`
  const searchWords = [query || '']

  return (
    <Card
      as="li"
      data-cy="news-list-item"
      data-id={id}
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Flex
        sx={{
          flex: 1,
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        {heroImage && (
          <InternalLink to={url}>
            <AspectRatio ratio={2 / 1}>
              <Image src={heroImage.publicUrl} sx={{ width: '100%' }} />{' '}
            </AspectRatio>
          </InternalLink>
        )}

        <Flex
          sx={{
            flexDirection: 'column',
            gap: 1,
            paddingX: 3,
            paddingY: 2,
          }}
        >
          <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
            <Heading
              data-cy="news-list-item-title"
              as="h2"
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

          <Flex>
            <UserNameTag
              userName={news.author?.username || ''}
              countryCode={news.author?.country || ''}
              created={news.createdAt}
            />
          </Flex>
        </Flex>

        <Flex
          sx={{
            display: ['none', 'flex', 'flex'],
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            gap: 12,
            paddingX: 12,
          }}
        >
          <IconCountWithTooltip
            count={news.usefulCount}
            icon="star-active"
            text={listing.usefulness}
          />
          <IconCountWithTooltip
            count={(news as any).commentCount || 0}
            icon="comment"
            text={listing.totalComments}
          />
        </Flex>
        <InternalLink to={url} sx={{ margin: 2 }}>
          <Button>Read more</Button>
        </InternalLink>
      </Flex>

      {query && (
        <Box sx={{ padding: 3, paddingTop: 0 }}>
          <Highlighter searchWords={searchWords} textToHighlight={body} />
        </Box>
      )}
    </Card>
  )
}
