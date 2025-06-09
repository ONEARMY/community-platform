import { Link as RouterLink } from '@remix-run/react'
import {
  Category,
  IconCountWithTooltip,
  ModerationStatus,
  Username,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Box, Card, Flex, Heading, Image } from 'theme-ui'

import type { Project } from 'oa-shared'

type LibraryCardProps = {
  item: Project
}

export const LibraryCard = ({ item }: LibraryCardProps) => {
  return (
    <RouterLink to={`/library/${encodeURIComponent(item.slug)}`}>
      <Card data-cy="card" sx={{ marginX: [2, 0] }}>
        {item.coverImage && (
          <Image
            style={{
              width: '100%',
              height: 'calc(((350px) / 3) * 2)',
              objectFit: 'cover',
            }}
            loading="lazy"
            src={cdnImageUrl(item.coverImage?.publicUrl || '', {
              width: 500,
            })}
            crossOrigin=""
            alt={`Cover image of ${item.title}`}
          />
        )}

        <Flex
          sx={{
            alignContent: 'stretch',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 2,
            justifyContent: 'space-between',
            justifyItems: 'stretch',
            padding: 2,
          }}
        >
          {item.moderation &&
            item.moderation !== IModerationStatus.ACCEPTED && (
              <Flex
                sx={{ alignSelf: 'flex-end', marginTop: -10, marginBottom: 2 }}
              >
                <ModerationStatus status={item.moderation} />
              </Flex>
            )}
          <Flex sx={{ gap: 1, flexDirection: 'column' }}>
            <Heading as="h2" variant="small" color={'black'}>
              {capitalizeFirstLetter(item.title || '')}
            </Heading>

            <Box>
              <Username
                user={{
                  userName: item.author?.username || '',
                  countryCode: item.author?.country,
                  isVerified: item.author?.isVerified,
                }}
                sx={{ position: 'relative' }}
              />
            </Box>
          </Flex>

          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {item.category && <Category category={item.category} />}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconCountWithTooltip
                count={item.commentCount || 0}
                icon="comment"
                text="Comments"
              />
              <IconCountWithTooltip
                count={item.usefulCount || 0}
                icon="star-active"
                text="How useful is it"
              />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </RouterLink>
  )
}
