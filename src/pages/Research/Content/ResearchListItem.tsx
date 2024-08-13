import { useMemo } from 'react'
import { PrimaryContentListItem, Username } from 'oa-components'
import { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { formatDate } from 'src/utils/date'
import { Text } from 'theme-ui'

import defaultResearchThumbnail from '../../../assets/images/default-research-thumbnail.jpg'
import { getPublicUpdates, researchStatusColour } from '../researchHelpers'

import type { IResearch } from 'src/models/research.models'
import type { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  item: IResearch.Item
}

const ResearchListItem = ({ item }: IProps) => {
  const { aggregationsStore } = useCommonStores().stores
  const collaborators = item.collaborators.length ? `${item.collaborators.length} ${item.collaborators.length === 1 ? 'contributor' : 'contributors'}` : null
  const usefulDisplayCount = item.totalUsefulVotes ?? 0

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
    <PrimaryContentListItem
      dataCy="ResearchListItem"
      category={item.researchCategory}
      creator={
        <>
          <Username
            user={{
              userName: item._createdBy,
              countryCode: item.creatorCountry,
              isVerified,
            }}
            sx={{ position: 'relative' }}
          />
          
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
                            <Text
                sx={{
                  color: 'darkGrey',
                  display: ['none', 'block'],
                  fontSize: 1,
                  transform: 'translateY(2px)',
                }}
              >

                {collaborators}
                </Text>
        </>
      }
      imageSrc={thumbnailUrl}
      link={`/research/${encodeURIComponent(item.slug)}`}
      title={item.title}
      status={
        <Text
          sx={{
            color: 'black',
            fontSize: 1,
            background: researchStatusColour(status),
            padding: 1,
            borderRadius: 1,
            whiteSpace: 'nowrap',
            minWidth: '75px',
          }}
        >
          {status}
        </Text>
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
