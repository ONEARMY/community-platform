import React from 'react'
import { Link as ExternalLink, Button } from 'rebass'
import Flex from 'src/components/Flex'
import Text from 'src/components/Text'
import styled from 'styled-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'
import ImageTargetBlank from 'src/assets/icons/link-target-blank.svg'
import { IEvent } from '../../models/events.models'
import { getMonth, getDay } from 'src/utils/helpers'
import Heading from 'src/components/Heading'

const GoToEventLink = styled(ExternalLink)`
  padding-right: 30px;
  position: relative;
  &:after {
    content: '';
    background-image: url(${ImageTargetBlank});
    width: 20px;
    height: 20px;
    z-index: 0;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: -5px;
    right: 0px;
  }
`

interface IProps {
  event: IEvent
}

export const EventCard = (props: IProps) => (
  <Flex
    card
    littleRadius
    littleScale
    bg={'white'}
    px={3}
    mt={4}
    py={3}
    flex={1}
    key={props.event.slug}
    flexDirection={['column', 'column', 'initial']}
    data-cy={'card'}
  >
    <Flex flexWrap={'wrap'} flex={'1'} mb={[1, 1, 0]} order={[1, 1, 1]}>
      <Flex
        alignItems={['center', 'center', 'center']}
        width={['auto', 'auto', 1]}
        mr={[1, 1, 0]}
      >
        <Text
          bold
          fontSize={[2, 2, 5]}
          textAlign={'center'}
          width={['auto', 'auto', 1]}
        >
          {getDay(new Date(props.event.date))}
        </Text>
      </Flex>
      <Flex
        alignItems={['center', 'center', 'center']}
        width={['auto', 'auto', 1]}
      >
        <Text
          bold
          fontSize={[2, 2, 5]}
          textAlign={'center'}
          width={['auto', 'auto', 1]}
        >
          {getMonth(new Date(props.event.date))}
        </Text>
      </Flex>
    </Flex>
    <Flex
      flexWrap={'wrap'}
      flex={'2'}
      px={[0, 0, 2]}
      order={[3, 3, 2]}
      mb={[2, 2, 0]}
    >
      <Flex alignItems={'center'} width={1}>
        <Text bold color="black" fontSize={[3, 3, 4]}>
          {props.event.title}
        </Text>
      </Flex>
      <Text auxiliary width={1}>
        By {props.event._createdBy}
      </Text>
    </Flex>
    <Flex
      flexWrap={'nowrap'}
      alignItems={'center'}
      flex={'1'}
      order={[2, 2, 3]}
      mb={[2, 2, 0]}
    >
      <FlagIconEvents code={props.event.location.countryCode} />
      <Text auxiliary width={1} ml={[1, 1, 2]}>
        {props.event.location.name},{' '}
        <Text inline auxiliary uppercase>
          {props.event.location.countryCode}
        </Text>
      </Text>
    </Flex>
    <Flex
      flexWrap="wrap"
      alignItems="center"
      flex="1"
      order={[4, 4, 4]}
      mb={[2, 2, 0]}
    >
      {props.event.tags &&
        Object.keys(props.event.tags).map(tag => {
          return <TagDisplay key={tag} tagKey={tag} />
        })}
    </Flex>
    <Flex
      flexWrap={'nowrap'}
      alignItems={'center'}
      flex={'1'}
      order={[5, 5, 5]}
    >
      <GoToEventLink
        target="_blank"
        href={props.event.url}
        color={'black'}
        mr={1}
        width={1}
      >
        <Text auxiliary width={1}>
          Go to event
        </Text>
      </GoToEventLink>
    </Flex>
  </Flex>
)

export default EventCard
