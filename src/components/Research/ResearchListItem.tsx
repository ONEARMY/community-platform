import React from 'react'
import { Box } from 'rebass/styled-components'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { Link } from 'src/components/Links'
import Text from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import styled from 'styled-components'

interface IProps {
  item: IResearch.ItemDB
}

const GridBox = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
`

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
      <GridBox px={3} py={3}>
        <Flex alignItems="center">
          <Heading small clipped color={'black'}>
            {item.title}
          </Heading>
        </Flex>
        <Flex alignItems="center">
          <Text auxiliary my={2} ml={1}>
            {item._createdBy}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="black">
            {item.updates.length === 1
              ? item.updates.length + ' update'
              : item.updates.length + ' updates'}
          </Text>
          <Text auxiliary>{item._created.slice(0, 10)}</Text>
        </Flex>
      </GridBox>
    </Link>
  </Flex>
)

export default ResearchListItem
