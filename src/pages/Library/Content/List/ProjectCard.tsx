import { Link as RouterLink } from '@remix-run/react'
import {
  Category,
  IconCountWithTooltip,
  ModerationStatus,
  Username,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Box, Card, Flex, Heading, Image } from 'theme-ui'

import type { Project } from 'oa-shared'

type ProjectCardProps = {
  item: Project
}

export const ProjectCard = ({ item }: ProjectCardProps) => {
  return (
    <Card data-cy="card" sx={{ marginX: [2, 0] }}>
      <RouterLink to={`/library/${encodeURIComponent(item.slug)}`}>
        {item.coverImage && (
          <Image
            style={{
              width: '100%',
              height: 'calc(((350px) / 3) * 2)',
              objectFit: 'cover',
            }}
            loading="lazy"
            src={item.coverImage?.publicUrl || ''}
            crossOrigin=""
            alt={`Cover image of ${item.title}`}
          />
        )}

        <Flex
          sx={{
            flexDirection: 'column',
            flexGrow: 1,
            gap: 2,
            justifyContent: 'space-between',
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
              />
            </Box>
          </Flex>

          <Flex
            sx={{
              justifyContent: 'flex-end',
              alignItems: 'stretch',
              alignContent: 'stretch',
            }}
          >
            {item.category && (
              <Flex sx={{ flex: 1 }}>
                <Category category={item.category} />
              </Flex>
            )}

            <Flex
              sx={{
                gap: 2,
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
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
            </Flex>
          </Flex>
        </Flex>
      </RouterLink>
    </Card>
  )
}
