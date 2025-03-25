import { useMemo } from 'react'
import {
  Category,
  DisplayDate,
  Icon,
  IconCountWithTooltip,
  InternalLink,
} from 'oa-components'
import { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { Box, Card, Flex, Grid, Heading, Image, Text } from 'theme-ui'

import defaultResearchThumbnail from '../../../assets/images/default-research-thumbnail.jpg'
import { researchStatusColour } from '../researchHelpers'

import type { ResearchItem } from 'src/models/research.model'

interface IProps {
  item: ResearchItem
}

const ResearchListItem = ({ item }: IProps) => {
  const collaborators = item['collaborators'] || []
  const usefulDisplayCount = item.usefulCount ?? 0

  const _commonStatisticStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: [1, 2, 2],
    ml: 3,
  }

  const status = item.status || ResearchStatus.IN_PROGRESS
  const modifiedDate = useMemo(() => getItemDate(item, 'long'), [item])

  return (
    <Card
      as="li"
      data-cy="ResearchListItem"
      data-id={item.id}
      sx={{ position: 'relative', mb: 3 }}
      variant="responsive"
    >
      <Flex sx={{ width: '100%', position: 'relative' }}>
        <Grid
          columns={[1, '60px 2fr 1fr']}
          gap="40px"
          sx={{
            width: '100%',
            padding: 3,
          }}
        >
          <Box
            sx={{
              display: ['none', 'block'],
            }}
          >
            <Image
              sx={{
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
              alt={`Thumbnail of ${item.title}`}
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
                  <InternalLink
                    to={`/research/${encodeURIComponent(item.slug)}`}
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
                {item.category && (
                  <Category
                    category={item.category}
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
                {/* <Username
                  user={{
                    userName: item.author.displayName,
                    countryCode: item.author.country,
                    isVerified: item.author.isVerified,
                  }}
                  sx={{ position: 'relative' }}
                /> */}
                {Boolean(collaborators.length) && (
                  <Text
                    sx={{
                      ml: 4,
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
                {modifiedDate !== '' && (
                  <Text
                    sx={{
                      ml: 4,
                      display: ['none', 'block'],
                      fontSize: 1,
                      color: 'darkGrey',
                      transform: 'translateY(2px)',
                    }}
                  >
                    {modifiedDate}
                  </Text>
                )}
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
                <Text color="black" sx={_commonStatisticStyle}>
                  {usefulDisplayCount}
                  <Icon glyph="star-active" ml={1} />
                </Text>
                <Text color="black" sx={_commonStatisticStyle}>
                  {item.commentCount}
                  <Icon glyph="comment" ml={1} />
                </Text>
                <Text
                  sx={{
                    ml: 3,
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
              count={item.commentCount || 0}
              icon="comment"
              text="Total comments"
            />

            <IconCountWithTooltip
              count={item.updateCount}
              dataCy="ItemUpdateText"
              icon="update"
              text="Amount of updates"
            />
          </Box>
        </Grid>
      </Flex>
    </Card>
  )
}

const getItemThumbnail = (researchItem: ResearchItem): string => {
  const publishedUpdates = researchItem.updates?.filter(
    (update) =>
      !update.deleted &&
      update.status === ResearchUpdateStatus.PUBLISHED &&
      (update.images?.length || 0) > 0,
  )

  const latestPublishedUpdate = publishedUpdates?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )?.[0]

  return (
    latestPublishedUpdate?.images?.at(0)?.publicUrl || defaultResearchThumbnail
  )
}

const getItemDate = (item: ResearchItem, variant: string) => {
  try {
    const contentModifiedDate = <DisplayDate date={item.modifiedAt!} />
    const creationDate = <DisplayDate date={item.createdAt} />

    if (item.modifiedAt !== item.createdAt) {
      return variant === 'long' ? (
        <>Updated {contentModifiedDate}</>
      ) : (
        contentModifiedDate
      )
    } else {
      return variant === 'long' ? <>Created {creationDate}</> : creationDate
    }
  } catch (err) {
    return ''
  }
}

export default ResearchListItem
