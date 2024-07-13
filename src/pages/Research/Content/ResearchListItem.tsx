import { useMemo } from 'react'
import { Icon, ResponsiveCard, Username } from 'oa-components'
import { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { formatDate } from 'src/utils/date'
import { Box, Flex, Text } from 'theme-ui'

import defaultResearchThumbnail from '../../../assets/images/default-research-thumbnail.jpg'
import { getPublicUpdates,researchStatusColour } from '../researchHelpers'

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

  const modifiedDate = useMemo(
    () => getItemDate(item, 'long'),
    [item._contentModifiedTimestamp, item._created],
  )
  const thumbnailUrl = useMemo(
    () => cdnImageUrl(getItemThumbnail(item), { width: 92 }),
    [item.updates, item._created],
  )

  return (
    <ResponsiveCard
      dataCy="ResearchListItem"
      dataId={item._id}
      imageSrc={thumbnailUrl}
      imageAlt={item.title}
      link={`/research/${encodeURIComponent(item.slug)}`}
      title={item.title}
      titleAs="h2"
      status={
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
      }
      additionalFooterContent={
        <>
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
        </>
      }
      iconCounts={[
        {
          count: usefulDisplayCount,
          icon: 'star-active',
          text: 'How useful is it',
        },
        {
          count: item.totalCommentCount || 0,
          icon: 'comment',
          text: 'Total comments',
        },
        {
          count: getUpdateCount(item),
          icon: 'update',
          text: 'Amount of updates',
          dataCy: 'ItemUpdateText',
        },
      ]}
    />
  )
}

const getItemThumbnail = (researchItem: IResearch.Item): string => {
  if (!researchItem.updates?.length) {
    return defaultResearchThumbnail
  }
    
  const publicUpdates = getPublicUpdates(researchItem)
  if (!publicUpdates.length) {
    return defaultResearchThumbnail
  }

  const latestImage = publicUpdates
    .map((u) => (u.images?.[0] as IUploadedFileMeta)?.downloadUrl)
    .filter((url: string) => !!url)
    .pop()

  return latestImage ?? defaultResearchThumbnail
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
