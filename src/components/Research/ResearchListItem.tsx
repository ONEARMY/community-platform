import { format } from 'date-fns'
import * as React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { Link } from 'src/components/Links'
import { ModerationStatusText } from 'src/components/ModerationStatusText'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import theme from 'src/themes/styled.theme'
import { VerifiedUserBadge } from '../VerifiedUserBadge/VerifiedUserBadge'

interface IProps {
  item: IResearch.ItemDB
}

const ResearchListItem: React.FC<IProps> = ({ item }) => (
  <Flex
    card
    mediumRadius
    mediumScale
    bg={'white'}
    data-cy="research=list-item"
    data-id={item._id}
    sx={{ width: '100%', position: 'relative' }}
    mb={3}
  >
    <Link
      to={`/research/${encodeURIComponent(item.slug)}`}
      key={item._id}
      sx={{ width: '100%' }}
    >
      <Flex px={3} py={3} sx={{ flexDirection: ['column', 'column', 'row'] }}>
        <Flex
          sx={{
            alignItems: 'center',
            width: ['100%', '100%', `${(1 / 2) * 100}%`],
          }}
        >
          <Heading small color={'black'}>
            {item.title}
          </Heading>
        </Flex>
        <Flex sx={{ alignItems: 'center', width: ['100%', '100%', '25%'] }}>
          <Text
            auxiliary
            my={2}
            ml={1}
            color={`${theme.colors.blue} !important`}
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
            auxiliary
            sx={{
              alignSelf:
                item.moderation !== 'accepted' ? 'flex-start' : 'center',
            }}
          >
            {format(new Date(item._modified), 'DD-MM-YYYY')}
          </Text>
        </Flex>
      </Flex>
      {item.moderation !== 'accepted' && (
        <ModerationStatusText
          moderatedContent={item}
          contentType="research"
          bottom={['36px', '36px', 0]}
          cropBottomRight
        />
      )}
    </Link>
  </Flex>
)

const getUpdateText = (item: IResearch.ItemDB) => {
  const count = item.updates?.length || 0
  const text = count === 1 ? 'update' : 'updates'
  return `${count} ${text}`
}

export default ResearchListItem
