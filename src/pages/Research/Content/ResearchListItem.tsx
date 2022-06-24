import { format } from 'date-fns'
import * as React from 'react'
import { Card, Flex, Heading, Text } from 'theme-ui'
import { ModerationStatus } from 'oa-components'
import type { IResearch } from 'src/models/research.models'
import theme from 'src/themes/styled.theme'
import { VerifiedUserBadge } from 'src/components/VerifiedUserBadge/VerifiedUserBadge'
import { Link } from 'react-router-dom'

interface IProps {
  item: IResearch.ItemDB
}

const ResearchListItem: React.FC<IProps> = ({ item }) => (
  <Card data-cy="ResearchListItem" data-id={item._id} mb={3}>
    <Flex sx={{ width: '100%', position: 'relative' }}>
      <Link
        to={`/research/${encodeURIComponent(item.slug)}`}
        key={item._id}
        style={{ width: '100%' }}
      >
        <Flex px={3} py={3} sx={{ flexDirection: ['column', 'column', 'row'] }}>
          <Flex
            sx={{
              alignItems: 'center',
              width: ['100%', '100%', `${(1 / 2) * 100}%`],
            }}
          >
            <Heading variant="small" color={'black'}>
              {item.title}
            </Heading>
          </Flex>
          <Flex sx={{ alignItems: 'center', width: ['100%', '100%', '25%'] }}>
            <Text
              my={2}
              ml={1}
              color={`${theme.colors.blue} !important`}
              sx={{
                ...theme.typography.auxiliary,
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
          </Flex>
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              width: ['100%', '100%', '25%'],
            }}
          >
            <Text color="black">{getUpdateText(item)}</Text>
            <Text
              sx={{
                alignSelf:
                  item.moderation !== 'accepted' ? 'flex-start' : 'center',
                ...theme.typography.auxiliary,
              }}
            >
              {format(new Date(item._modified), 'DD-MM-YYYY')}
            </Text>
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

const getUpdateText = (item: IResearch.ItemDB) => {
  const count = item.updates?.length || 0
  const text = count === 1 ? 'update' : 'updates'
  return `${count} ${text}`
}

export default ResearchListItem
