import { format } from 'date-fns'
import { Icon, ModerationStatus, Username } from 'oa-components'
import { Link } from 'react-router-dom'
import { isUserVerified } from 'src/common/isUserVerified'
import type { IResearch } from 'src/models/research.models'
import { Card, Flex, Grid, Heading, Text, Box } from 'theme-ui'

interface IProps {
  item: IResearch.ItemDB & {
    votedUsefulCount: number
  }
}

const ResearchListItem = ({ item }: IProps) => {
  const collaborators = item['collaborators'] || []
  const usefulDisplayCount =
    item.votedUsefulCount > 0 ? item.votedUsefulCount : '0'

  const _commonStatisticStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: [1, 2, 2],
  }
  return (
    <Card data-cy="ResearchListItem" data-id={item._id} mb={3}>
      <Flex sx={{ width: '100%', position: 'relative' }}>
        <Link
          to={`/research/${encodeURIComponent(item.slug)}`}
          key={item._id}
          style={{ width: '100%' }}
        >
          <Grid
            px={3}
            py={3}
            columns={[1, '2fr minmax(274px, 1fr)']}
            gap="60px"
          >
            <Flex
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Heading
                color={'black'}
                mb={2}
                sx={{
                  fontSize: [3, 3, 4],
                }}
              >
                {item.title}
              </Heading>
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
                    isVerified={isUserVerified(item._createdBy)}
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
                    {calculateTotalComments(item)}
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
              <Text color="black" sx={_commonStatisticStyle}>
                {usefulDisplayCount}
                <Icon glyph="star-active" ml={1} />
              </Text>
              <Text color="black" sx={_commonStatisticStyle}>
                {calculateTotalComments(item)}
                <Icon glyph="comment" ml={1} />
              </Text>
              <Text
                color="black"
                sx={_commonStatisticStyle}
                data-cy="ItemUpdateText"
              >
                {getUpdateText(item)}
                <Icon glyph="update" ml={1} />
              </Text>
            </Box>
          </Grid>
          {item.moderation !== 'accepted' && (
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

const getItemDate = (item: IResearch.ItemDB, variant: string): string => {
  const contentModifiedDate = format(
    new Date(item._contentModifiedTimestamp || item._modified),
    'DD-MM-YYYY',
  )
  const creationDate = format(new Date(item._created), 'DD-MM-YYYY')

  if (contentModifiedDate !== creationDate) {
    return variant === 'long'
      ? `Updated ${contentModifiedDate}`
      : contentModifiedDate
  } else {
    return variant === 'long' ? `Created ${creationDate}` : creationDate
  }
}

const calculateTotalComments = (item: IResearch.ItemDB) => {
  if (item.updates) {
    const commentOnUpdates = item.updates.reduce((totalComments, update) => {
      const updateCommentsLength = update.comments ? update.comments.length : 0
      return totalComments + updateCommentsLength
    }, 0)

    return commentOnUpdates ? String(commentOnUpdates) : '0'
  } else {
    return '0'
  }
}

const getUpdateText = (item: IResearch.ItemDB) => {
  return item.updates?.length
    ? String(
        item.updates.filter(
          (update) => update.status !== 'draft' && update._deleted !== true,
        ).length,
      )
    : '0'
}

export default ResearchListItem
