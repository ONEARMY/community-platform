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
    key={props.event._id}
    flexDirection={['column', 'initial']}
  >
    <Flex flexWrap={'wrap'} flex={'1'}>
      <Heading txtcenter medium width={1}>
        {getDay(new Date(props.event.date))}
      </Heading>
      <Heading txtcenter medium width={1}>
        {getMonth(new Date(props.event.date))}
      </Heading>
    </Flex>
    <Flex flexWrap={'wrap'} flex={'2'} px={4}>
      <Heading small color="black" width={1}>
        {props.event.title}
      </Heading>
      <Text auxiliary width={1}>
        By {props.event._createdBy}
      </Text>
    </Flex>
    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
      <FlagIconEvents code={props.event.location.countryCode} />
      <Text auxiliary width={1} ml={2}>
        {props.event.location.name},{' '}
        <Text inline auxiliary uppercase>
          {props.event.location.countryCode}
        </Text>
      </Text>
    </Flex>
    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
      {props.event.tags &&
        Object.keys(props.event.tags).map(tag => {
          return <TagDisplay key={tag} tagKey={tag} />
        })}
    </Flex>
    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
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
