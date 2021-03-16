import { format } from 'date-fns'
import React from 'react'
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
    data-cy="card"
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
          <Text color="black">
            {item.updates.length === 1
              ? item.updates.length + ' update'
              : item.updates.length + ' updates'}
          </Text>
          <Text auxiliary alignSelf="flex-start">
            {format(new Date(item._created), 'DD-MM-YYYY')}
          </Text>
        </Flex>
      </Flex>
      {item.moderation !== 'accepted' && (
        <ModerationStatusText
          moderable={item}
          kind="research"
          bottom={'0'}
          color="red"
          cropBottomRight
        />
      )}
    </Link>
  </Flex>
)

export default ResearchListItem
