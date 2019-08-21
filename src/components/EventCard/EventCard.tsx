import React from 'react'
import { Link as ExternalLink, Button } from 'rebass'
import Flex from 'src/components/Flex'
import Text from 'src/components/Text'
import styled from 'styled-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'
import ImageTargetBlank from 'src/assets/icons/link-target-blank.svg'
import { IEvent } from '../../models/events.models'

const EventCardContainer = styled(Flex)`
  border: 2px solid black;
  border-radius: 5px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.01);
  }
`

const GoToEventLink = styled(ExternalLink)`
  padding-right: 30px;
  position: relative
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

export class EventCard extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public getMonth(d: Date) {
    // use ECMAScript Internationalization API to return month
    return `${d.toLocaleString('en-us', { month: 'long' })}`
  }
  public getDay(d: Date) {
    return `${d.getDate()}`
  }

  render() {
    return (
      <>
        <Flex
          card
          litleRadius
          litleScale
          px={3}
          mt={4}
          py={3}
          flex={1}
          key={this.props.event._id}
          flexDirection={['column', 'initial']}
        >
          <Flex flexWrap={'wrap'} flex={'1'}>
            <Text txtcenter dateTitle width={1}>
              {this.getDay(new Date(this.props.event.date))}
            </Text>
            <Text txtcenter dateTitle width={1}>
              {this.getMonth(new Date(this.props.event.date))}
            </Text>
          </Flex>
          <Flex flexWrap={'wrap'} flex={'2'} px={4}>
            <Text cardTitle color="black" width={1}>
              {this.props.event.title}
            </Text>
            <Text auxiliary width={1}>
              By {this.props.event._createdBy}
            </Text>
          </Flex>
          <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
            <FlagIconEvents code={this.props.event.location.countryCode} />
            <Text auxiliary width={1} ml={2}>
              {this.props.event.location.name},{' '}
              <Text inline auxiliary uppercase>
                {this.props.event.location.countryCode}
              </Text>
            </Text>
          </Flex>
          <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
            {this.props.event.tags &&
              Object.keys(this.props.event.tags).map(tag => {
                return <TagDisplay key={tag} tagKey={tag} />
              })}
          </Flex>
          <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
            <GoToEventLink
              target="_blank"
              href={this.props.event.url}
              color={'black'}
              mr={1}
              width={1}
            >
              <Text auxiliary txtright width={1}>
                Go to event
              </Text>
            </GoToEventLink>
          </Flex>
        </Flex>
      </>
    )
  }
}

export default EventCard
