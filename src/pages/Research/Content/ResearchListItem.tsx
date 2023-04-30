import styled from '@emotion/styled'
import { format } from 'date-fns'
import { Icon, ModerationStatus, Username } from 'oa-components'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { isUserVerified } from 'src/common/isUserVerified'
import type { IResearch } from 'src/models/research.models'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { Card, Flex, Grid, Heading, Text } from 'theme-ui'

interface IProps {
  item: IResearch.ItemDB & {
    votedUsefulCount: number | string
  }
}

const DesktopItemInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (max-width: ${theme.breakpoints[0]}) {
    display: none;
    align-items: unset;
    justify-content: unset;
  }
`

const MobileItemInfo = styled.div`
  display: none;

  @media (max-width: ${theme.breakpoints[0]}) {
    display: flex;
    align-items: center;
  }
`

const ResearchListItem = ({ item }: IProps) => {
  const collaborators = item['collaborators'] || []
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
                  fontSize: ['18px', '18px', '22px'],
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
                        fontSize: theme.fontSizes[1] + 'px',
                        color: theme.colors.darkGrey,
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
                      fontSize: theme.fontSizes[1] + 'px',
                      color: theme.colors.darkGrey,
                      transform: 'translateY(2px)',
                    }}
                  >
                    {getItemDate(item, 'long')}
                  </Text>
                </Flex>
                {/* Show these on mobile, hide on tablet & above. */}
                <MobileItemInfo>
                  <Text
                    color="black"
                    ml={3}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: ['12px', '16px', '16px'],
                    }}
                  >
                    {item.votedUsefulCount}
                    <Icon glyph="star-active" ml={1} />
                  </Text>
                  <Text
                    color="black"
                    ml={3}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: ['12px', '16px', '16px'],
                    }}
                  >
                    {calculateTotalComments(item)}
                    <Icon glyph="comment" ml={1} mb={-1} />
                  </Text>
                  <Text
                    ml={3}
                    sx={{
                      display: ['block', 'none'],
                      fontSize: '12px',
                      color: theme.colors.darkGrey,
                    }}
                  >
                    {getItemDate(item, 'short')}
                  </Text>
                </MobileItemInfo>
              </Flex>
            </Flex>
            {/* Hide these on mobile, show on tablet & above. */}
            <DesktopItemInfo>
              <Text color="black" sx={{ fontSize: ['12px', '16px', '16px'] }}>
                {item.votedUsefulCount}
              </Text>
              <Text color="black" sx={{ fontSize: ['12px', '16px', '16px'] }}>
                {calculateTotalComments(item)}
              </Text>
              <Text
                color="black"
                sx={{ fontSize: ['12px', '16px', '16px'] }}
                data-cy="ItemUpdateText"
              >
                {getUpdateText(item)}
              </Text>
            </DesktopItemInfo>
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
  const lastModifiedDate = format(new Date(item._modified), 'DD-MM-YYYY')
  const creationDate = format(new Date(item._created), 'DD-MM-YYYY')

  if (lastModifiedDate !== creationDate) {
    return variant === 'long' ? `Updated ${lastModifiedDate}` : lastModifiedDate
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

    return commentOnUpdates ? String(commentOnUpdates) : '-'
  } else {
    return '-'
  }
}

const getUpdateText = (item: IResearch.ItemDB) => {
  return item.updates?.length ? String(item.updates?.length) : '-'
}

export default ResearchListItem
