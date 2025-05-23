import { Link } from '@remix-run/react'
import { Icon } from 'oa-components'
import { Flex, Heading, Text } from 'theme-ui'

interface IProps {
  type: 'library' | 'research' | 'questions'
  item: {
    id: string | number
    title: string
    slug: string
    usefulVotes: number
  }
}

const UserDocumentItem = ({ type, item }: IProps) => {
  const { id, title, slug, usefulVotes } = item
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
            as="p"
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
            {(
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
                {usefulVotes}
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
