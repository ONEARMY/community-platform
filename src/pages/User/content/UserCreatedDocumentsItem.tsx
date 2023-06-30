import { Icon } from 'oa-components'
import * as React from 'react'
import { Flex, Heading, Text } from 'theme-ui'
import { Link } from 'react-router-dom'

interface IProps {
  type: 'event' | 'how-to' | 'research'
  item: Record<string, any>
}

const UserDocumentItem = ({ type, item }: IProps) => {
  const { id, title, slug } = item
  const totalUseful = (item.votedUsefulBy || []).length
  const url = `/${type}/${encodeURIComponent(slug)}?utm_source=user-profile`

  return (
    <Flex
      mb={1}
      sx={{
        width: '100%',
        position: 'relative',
        borderBottom: '1px solid #c7c7c7',
      }}
    >
      <Link
        to={url}
        key={id}
        style={{ width: '100%' }}
        data-testid={`${type}-link`}
      >
        <Flex
          pb={1}
          pt={1}
          sx={{
            flexDirection: 'row',
            justifyItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Heading
            color={'black'}
            sx={{
              fontSize: ['12px', '12px', '16px'],
            }}
          >
            {title}
          </Heading>
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {totalUseful > 0 && (
              <Text
                color="black"
                ml={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: ['12px', '12px', '14px'],
                  minWidth: '40px',
                  justifyContent: 'flex-end',
                }}
              >
                {totalUseful}
                <Icon glyph="star-active" ml={1} />
              </Text>
            )}
          </Flex>
        </Flex>
      </Link>
    </Flex>
  )
}

export default UserDocumentItem
