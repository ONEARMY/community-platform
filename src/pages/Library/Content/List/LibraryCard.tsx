import { Link as RouterLink } from '@remix-run/react'
import {
  Category,
  IconCountWithTooltip,
  ModerationStatus,
  Username,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Box, Card, Flex, Heading, Image } from 'theme-ui'

import type { ILibrary } from 'oa-shared'

interface IProps {
  item: ILibrary.Item
}

export const LibraryCard = ({ item }: IProps) => {
  const {
    _createdBy,
    _id,
    category,
    cover_image,
    cover_image_alt,
    creatorCountry,
    moderation,
    slug,
    title,
    totalComments,
    totalUsefulVotes,
  } = item
  const { aggregationsStore } = useCommonStores().stores

  const isVerified = aggregationsStore.isVerified(_createdBy)

  return (
    <Card data-cy="card" sx={{ marginX: [2, 0] }}>
      <RouterLink key={_id} to={`/library/${encodeURIComponent(slug)}`}>
        <Image
          style={{
            width: '100%',
            height: 'calc(((350px) / 3) * 2)',
            objectFit: 'cover',
          }}
          loading="lazy"
          src={cdnImageUrl(cover_image?.downloadUrl || '', {
            width: 500,
          })}
          crossOrigin=""
          alt={cover_image_alt ?? `Cover image of ${title}`}
        />
      </RouterLink>

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
        {moderation !== IModerationStatus.ACCEPTED && (
          <Flex sx={{ alignSelf: 'flex-end', marginTop: -10, marginBottom: 2 }}>
            <ModerationStatus status={moderation} contentType="library" />
          </Flex>
        )}
        <Flex sx={{ gap: 1, flexDirection: 'column' }}>
          <Heading as="h2" variant="small" color={'black'}>
            <RouterLink
              key={_id}
              to={`/library/${encodeURIComponent(slug)}`}
              style={{ width: '100%', color: 'black' }}
            >
              {capitalizeFirstLetter(title || '')}
            </RouterLink>
          </Heading>

          <Box>
            <Username
              user={{
                userName: _createdBy,
                countryCode: creatorCountry,
                isVerified,
              }}
            />
          </Box>
        </Flex>

        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>{category && <Category category={category} />}</Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconCountWithTooltip
              count={totalComments || 0}
              icon="comment"
              text="Comments"
            />
            <IconCountWithTooltip
              count={totalUsefulVotes || 0}
              icon="star-active"
              text="How useful is it"
            />
          </Box>
        </Flex>
      </Flex>
    </Card>
  )
}
