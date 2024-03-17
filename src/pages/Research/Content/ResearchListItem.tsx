import { Link } from 'react-router-dom'
import {
  Category,
  Icon,
  IconCountWithTooltip,
  ModerationStatus,
  Username,
} from 'oa-components'
import {
  IModerationStatus,
  ResearchStatus,
  ResearchUpdateStatus,
} from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { formatDate } from 'src/utils/date'
import {
  getPublicUpdates,
  getResearchTotalCommentCount,
  researchStatusColour,
} from 'src/utils/helpers'
import { Box, Card, Flex, Grid, Heading, Image, Text } from 'theme-ui'

import defaultResearchThumbnail from '../../../assets/images/default-research-thumbnail.jpg'

import type { ITag } from 'src/models'
import type { IResearch } from 'src/models/research.models'
import type { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  item: IResearch.ItemDB & {
    votedUsefulCount: number
  } & { tagList?: ITag[] }
}

const ResearchListItem = ({ item }: IProps) => {
  const { aggregationsStore } = useCommonStores().stores
  const collaborators = item['collaborators'] || []
  const usefulDisplayCount =
    item.votedUsefulCount > 0 ? item.votedUsefulCount : 0

  const _commonStatisticStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: [1, 2, 2],
  }

  const status = item.researchStatus || ResearchStatus.IN_PROGRESS

  return (
    <Card data-cy="ResearchListItem" data-id={item._id} mb={3}>
      <Flex sx={{ width: '100%', position: 'relative' }}>
        <Link
          to={`/research/${encodeURIComponent(item.slug)}`}
          key={item._id}
          style={{ width: '100%' }}
        >
          <Grid px={3} py={3} columns={[1, '60px 2fr 1fr']} gap="40px">
            <Box
              sx={{
                display: ['none', 'block'],
              }}
            >
              <Image
                style={{
                  width: `calc(100% + 32px)`,
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  margin: '-15px',
                  verticalAlign: 'top',
                  maxWidth: 'none',
                }}
                loading="lazy"
                src={cdnImageUrl(getItemThumbnail(item), {
                  width: 125,
                })}
                crossOrigin=""
              />
            </Box>
            <Flex
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  width: '100%',
                  mb: [1, 0],
                }}
              >
                <Flex sx={{ flexDirection: ['column', 'row'], gap: [0, 3] }}>
                  <Heading
                    color={'black'}
                    mb={1}
                    sx={{
                      fontSize: [3, 3, 4],
                    }}
                  >
                    {item.title}
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
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Flex sx={{ alignItems: 'center' }}>
                  <Username
                    user={{
                      userName: item._createdBy,
                      countryCode: item.creatorCountry,
                    }}
                    isVerified={isUserVerifiedWithStore(
                      item._createdBy,
                      aggregationsStore,
                    )}
                  />
                  {Boolean(collaborators.length) && (
                    <Text
                      ml={4}
                      sx={{
                        display: ['none', 'block'],
                        fontSize: 1,
                        color: 'darkGrey',
                        transform: 'translateY(2px)',
                      }}
                    >
                      {collaborators.length +
                        (collaborators.length === 1
                          ? ' contributor'
                          : ' contributors')}
                    </Text>
                  )}
                  {/* Hide this on mobile, show on tablet & above. */}
                  <Text
                    ml={4}
                    sx={{
                      display: ['none', 'block'],
                      fontSize: 1,
                      color: 'darkGrey',
                      transform: 'translateY(2px)',
                    }}
                  >
                    {getItemDate(item, 'long')}
                  </Text>
                  <Text
                    sx={{
                      display: ['none', 'inline-block', 'inline-block'],
                      verticalAlign: 'middle',
                      color: 'black',
                      fontSize: 1,
                      background: researchStatusColour(status),
                      padding: 1,
                      borderRadius: 1,
                      borderBottomRightRadius: 1,
                      marginLeft: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {status}
                  </Text>
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
                    {getResearchTotalCommentCount(item)}
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
            <Box
              sx={{
                display: ['none', 'flex', 'flex'],
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <IconCountWithTooltip
                count={usefulDisplayCount}
                icon="star-active"
                text="How useful is it"
              />
              <IconCountWithTooltip
                count={getResearchTotalCommentCount(item)}
                icon="comment"
                text="Total comments"
              />

              <IconCountWithTooltip
                count={getUpdateCount(item)}
                dataCy="ItemUpdateText"
                icon="update"
                text="Amount of updates"
              />
            </Box>
          </Grid>
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
        </Link>
      </Flex>
    </Card>
  )
}

const getItemThumbnail = (researchItem: IResearch.ItemDB): string => {
  if (researchItem.updates?.length) {
    const latestImage = getPublicUpdates(researchItem)
      ?.map((u) => (u.images?.[0] as IUploadedFileMeta)?.downloadUrl)
      .filter((url: string) => !!url)
      .pop()
    return latestImage ?? defaultResearchThumbnail
  } else {
    return defaultResearchThumbnail
  }
}

const getItemDate = (item: IResearch.ItemDB, variant: string): string => {
  const contentModifiedDate = formatDate(
    new Date(item._contentModifiedTimestamp || item._modified),
  )
  const creationDate = formatDate(new Date(item._created))

  if (contentModifiedDate !== creationDate) {
    return variant === 'long'
      ? `Updated ${contentModifiedDate}`
      : contentModifiedDate
  } else {
    return variant === 'long' ? `Created ${creationDate}` : creationDate
  }
}

const getUpdateCount = (item: IResearch.ItemDB) => {
  return item.updates?.length
    ? item.updates.filter(
        (update) =>
          update.status !== ResearchUpdateStatus.DRAFT && !update._deleted,
      ).length
    : 0
}

export default ResearchListItem
