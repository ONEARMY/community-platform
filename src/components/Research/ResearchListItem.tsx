import { format } from 'date-fns'
import * as React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { Link } from 'src/components/Links'
import { ModerationStatusText } from 'src/components/ModerationStatusText'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import theme from 'src/themes/styled.theme'

interface IProps {
  item: IResearch.ItemDB
}

const ResearchListItem: React.FC<IProps> = ({ item }) => (
  <Flex
    card
    mediumRadius
    mediumScale
    bg={'white'}
    width={1}
    data-cy="research=list-item"
    data-id={item._id}
    sx={{ position: 'relative' }}
    mb={3}
  >
    <Link
      to={`/research/${encodeURIComponent(item.slug)}`}
      key={item._id}
      width={1}
    >
      <Flex px={3} py={3} flexDirection={['column', 'column', 'row']}>
        <Flex alignItems="center" width={[1, 1, 1 / 2]}>
          <Heading small color={'black'}>
            {item.title}
          </Heading>
        </Flex>
        <Flex alignItems="center" width={[1, 1, 1 / 4]}>
          <Text
            auxiliary
            my={2}
            ml={1}
            color={`${theme.colors.blue} !important`}
          >
            {item._createdBy}
          </Text>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width={[1, 1, 1 / 4]}
        >
          <Text color="black">{getUpdateText(item)}</Text>
          <Text
            auxiliary
            alignSelf={item.moderation !== 'accepted' ? 'flex-start' : 'center'}
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
