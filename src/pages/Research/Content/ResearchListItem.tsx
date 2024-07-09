import { useMemo } from 'react'
import {
  Category,
  Icon,
  IconCountWithTooltip,
  InternalLink,
  ModerationStatus,
  Username,
} from 'oa-components'
import {
  IModerationStatus,
  ResearchStatus,
  ResearchUpdateStatus,
} from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { formatDate } from 'src/utils/date'
import { Box, Card, Flex, Heading, Image, Text } from 'theme-ui'

import defaultResearchThumbnail from '../../../assets/images/default-research-thumbnail.jpg'
import { researchStatusColour } from '../researchHelpers'

import type { IResearch } from 'src/models/research.models'
import type { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  item: IResearch.Item
}

const ResearchListItem = ({ item }: IProps) => {
  const { aggregationsStore } = useCommonStores().stores
  const collaborators = item['collaborators'] || []
  const usefulDisplayCount = item.totalUsefulVotes ?? 0

  const _commonStatisticStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: [1, 2, 2],
  }

  const isVerified = aggregationsStore.isVerified(item._createdBy)
  const status = item.researchStatus || ResearchStatus.IN_PROGRESS
  const modifiedDate = useMemo(() => getItemDate(item, 'long'), [item])

  return (
    <Card
      as={'li'}
      data-cy="ResearchListItem"
      data-id={item._id}
      mb={3}
      style={{ position: 'relative' }}
    >
      <Flex sx={{ flex: 1 }}>
        <Flex>
          <Box
            sx={{
              display: ['none', 'block'],
              height: '100%',
              width: '125px',
            }}
          >
            <Image
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                verticalAlign: 'top',
              }}
              loading="lazy"
              src={cdnImageUrl(getItemThumbnail(item), { width: 125 })}
              crossOrigin=""
            />
          </Box>
        </Flex>
        <Flex sx={{ flex: 1 }}>
          <Flex
            sx={{
              flex: 1,
              flexDirection: 'column',
              gap: 1,
              padding: 3,
            }}
          >
            <Flex
              sx={{
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'baseline',
              }}
            >
              <Flex
                sx={{
                  flexDirection: ['column', 'row'],
                  gap: [1, 3],
                  alignItems: 'baseline',
                }}
              >
                <Heading
                  color={'black'}
                  mb={1}
                  sx={{
                    fontSize: [3, 3, 4],
                    margin: 0,
                  }}
                >
                  <InternalLink
                    to={`/research/${encodeURIComponent(item.slug)}`}
                    key={item._id}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:focus': {
                        outline: 'none',
                        textDecoration: 'none',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                      },
                    }}
                  >
                    {item.title}
                  </InternalLink>
                </Heading>
                {item.researchCategory && (
                  <Category
                    category={item.researchCategory}
                    sx={{ fontSize: 2, mt: [0, '3px'] }}
                  />
                )}
              </Flex>
              <Text
                sx={{
                  display: ['inline-block', 'none', 'none'],
                  verticalAlign: 'middle',
                  color: 'black',
                  fontSize: 1,
                  background: researchStatusColour(status),
                  padding: 1,
                  borderRadius: 1,
                  marginLeft: 4,
                  marginBottom: 'auto',
                  whiteSpace: 'nowrap',
                  minWidth: '75px',
                }}
                data-cy="ItemResearchStatus"
              >
                {status}
              </Text>
            </Flex>
            <Flex
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Flex
                sx={{
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ minWidth: 'min-content' }}>
                  <Username
                    user={{
                      userName: item._createdBy,
                      countryCode: item.creatorCountry,
                      isVerified,
                    }}
                    sx={{ position: 'relative' }}
                  />
                </Box>
                {Boolean(collaborators.length) && (
                  <Box sx={{ minWidth: 'min-content' }}>
                    <Text
                      sx={{
                        color: 'darkGrey',
                        display: ['none', 'block'],
                        fontSize: 1,
                        transform: 'translateY(2px)',
                      }}
                    >
                      {collaborators.length +
                        (collaborators.length === 1
                          ? ' contributor'
                          : ' contributors')}
                    </Text>
                  </Box>
                )}
                {/* Hide this on mobile, show on tablet & above. */}
                {modifiedDate && (
                  <Box sx={{ minWidth: 'min-content' }}>
                    <Text
                      sx={{
                        color: 'darkGrey',
                        display: ['none', 'block'],
                        fontSize: 1,
                        transform: 'translateY(2px)',
                      }}
                    >
                      {modifiedDate}
                    </Text>
                  </Box>
                )}
                <Box sx={{ minWidth: 'min-content' }}>
                  <Text
                    sx={{
                      background: researchStatusColour(status),
                      borderBottomRightRadius: 1,
                      borderRadius: 1,
                      color: 'black',
                      display: ['none', 'inline-block', 'inline-block'],
                      fontSize: 1,
                      padding: 1,
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {status}
                  </Text>
                </Box>
              </Flex>
              {/* Show these on mobile, hide on tablet & above. */}
              <Box
                sx={{
                  display: ['flex', 'none', 'none'],
                  alignItems: 'center',
                }}
              >
                <Text color="black" ml={3} sx={_commonStatisticStyle}>
                  {usefulDisplayCount}
                  <Icon glyph="star-active" ml={1} />
                </Text>
                <Text color="black" ml={3} sx={_commonStatisticStyle}>
                  {item.totalCommentCount}
                  <Icon glyph="comment" ml={1} />
                </Text>
                <Text
                  ml={3}
                  sx={{
                    display: ['block', 'none'],
                    fontSize: 1,
                    color: 'darkGrey',
                  }}
                >
                  {getItemDate(item, 'short')}
                </Text>
              </Box>
            </Flex>
          </Flex>
          {/* Hide these on mobile, show on tablet & above. */}

          <Flex
            sx={{
              display: ['none', 'flex', 'flex'],
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: [3, 6, 12],
              paddingX: [3, 6, 12],
            }}
          >
            <Box>
              <IconCountWithTooltip
                count={usefulDisplayCount}
                icon="star-active"
                text="How useful is it"
              />
            </Box>
            <Box>
              <IconCountWithTooltip
                count={item.totalCommentCount || 0}
                icon="comment"
                text="Total comments"
              />
            </Box>
            <Box>
              <IconCountWithTooltip
                count={getUpdateCount(item)}
                dataCy="ItemUpdateText"
                icon="update"
                text="Amount of updates"
              />
            </Box>
          </Flex>
        </Flex>
        {item.moderation !== IModerationStatus.ACCEPTED && (
          <ModerationStatus
            status={item.moderation}
            contentType="research"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          />
        )}
      </Flex>
    </Card>
  )
}

const getItemThumbnail = (researchItem: IResearch.Item): string => {
  const publishedUpdates = researchItem.updates?.filter(
    (update) =>
      !update._deleted &&
      update.status === ResearchUpdateStatus.PUBLISHED &&
      update.images.length > 0,
  )

  const latestPublishedUpdate = publishedUpdates?.sort(
    (a, b) => new Date(b._created).getTime() - new Date(a._created).getTime(),
  )?.[0]

  return (
    (latestPublishedUpdate?.images[0] as IUploadedFileMeta)?.downloadUrl ||
    defaultResearchThumbnail
  )
}

const getItemDate = (item: IResearch.Item, variant: string): string => {
  try {
    const contentModifiedDate = formatDate(
      new Date(item._contentModifiedTimestamp),
    )
    const creationDate = formatDate(new Date(item._created))

    if (contentModifiedDate !== creationDate) {
      return variant === 'long'
        ? `Updated ${contentModifiedDate}`
        : contentModifiedDate
    } else {
      return variant === 'long' ? `Created ${creationDate}` : creationDate
    }
  } catch (err) {
    return ''
  }
}

const getUpdateCount = (item: IResearch.Item) => {
  return item.updates?.length
    ? item.updates.filter(
        (update) =>
          update.status !== ResearchUpdateStatus.DRAFT && !update._deleted,
      ).length
    : 0
}

export default ResearchListItem
