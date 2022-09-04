import { format } from 'date-fns'
import { FlagIconHowTos, ModerationStatus } from 'oa-components'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { VerifiedUserBadge } from 'src/components/VerifiedUserBadge/VerifiedUserBadge'
import { useCommonStores } from 'src/index'
import type { IResearch } from 'src/models/research.models'
import theme from 'src/themes/styled.theme'
import { Card, Flex, Heading, Text } from 'theme-ui'

interface IProps {
  item: IResearch.ItemDB
}

const ResearchListItem: React.FC<IProps> = ({ item }) => {
  const { aggregationsStore } = useCommonStores().stores
  const { aggregations } = aggregationsStore

  const votedUsefulCount = aggregations.users_votedUsefulResearch
    ? aggregations.users_votedUsefulResearch[item._id] || 0
    : '...'

  return (
    <Card data-cy="ResearchListItem" data-id={item._id} mb={3}>
      <Flex sx={{ width: '100%', position: 'relative' }}>
        <Link
          to={`/research/${encodeURIComponent(item.slug)}`}
          key={item._id}
          style={{ width: '100%' }}
        >
          <Flex
            px={3}
            py={3}
            sx={{ flexDirection: ['column', 'column', 'row'] }}
          >
            <Flex
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: ['100%', '100%', `${(1 / 2) * 100}%`],
              }}
            >
              <Heading variant="small" color={'black'}>
                {item.title}
              </Heading>
              <Flex
                sx={{
                  alignItems: 'center',
                }}
              >
                {item.creatorCountry && (
                  <FlagIconHowTos code={item.creatorCountry} />
                )}
                <Text
                  my={2}
                  color={`${theme.colors.blue} !important`}
                  sx={{
                    ...theme.typography.auxiliary,
                    marginLeft: '6px',
                  }}
                >
                  {item._createdBy}
                </Text>
                <VerifiedUserBadge
                  userId={item._createdBy}
                  ml={1}
                  height="12px"
                  width="12px"
                />
                <Text
                  ml={4}
                  sx={{
                    fontSize: theme.fontSizes[1] + 'px',
                    color: theme.colors.darkGrey,
                  }}
                >
                  {getItemDate(item)}
                </Text>
              </Flex>
            </Flex>
            <Flex
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: ['100%', '100%', '25%'],
              }}
            >
              <Text color="black">{votedUsefulCount}</Text>
              <Text color="black">{calculateTotalComments(item)}</Text>
              <Text color="black">{getUpdateText(item)}</Text>
              {/* <Text
                sx={{
                  alignSelf:
                    item.moderation !== 'accepted' ? 'flex-start' : 'center',
                  ...theme.typography.auxiliary,
                }}
              >
                {format(new Date(item._modified), 'DD-MM-YYYY')}
              </Text> */}
            </Flex>
          </Flex>
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

const getItemDate = (item: IResearch.ItemDB): string => {
  const lastModifiedDate = format(new Date(item._modified), 'DD-MM-YYYY')
  const creationDate = format(new Date(item._created), 'DD-MM-YYYY')
  if (lastModifiedDate !== creationDate) {
    return `Updated ${lastModifiedDate}`
  } else {
    return `Created ${creationDate}`
  }
}

const calculateTotalComments = (item: IResearch.ItemDB) => {
  if (item.updates) {
    return item.updates.reduce((totalComments, update) => {
      const updateCommentsLength = update.comments ? update.comments.length : 0
      return totalComments + updateCommentsLength
    }, 0)
  } else {
    return 0
  }
}

const getUpdateText = (item: IResearch.ItemDB) => {
  return item.updates?.length || 0
}

export default ResearchListItem
