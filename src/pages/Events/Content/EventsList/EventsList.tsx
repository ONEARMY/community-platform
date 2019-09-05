import * as React from 'react'
import { IEvent } from 'src/models/events.models'
import { Link } from 'src/components/Links'
import { Flex, Link as ExternalLink } from 'rebass'
import { Button } from 'src/components/Button'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import Heading from 'src/components/Heading'
import EventCard from 'src/components/EventCard/EventCard'

interface IProps {
  upcomingEvents: IEvent[]
}

export class EventsList extends React.Component<IProps> {
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

  public render() {
    const { upcomingEvents } = this.props
    return (
      <>
        <Flex py={26}>
          <Heading medium txtcenter bold width={1}>
            Precious Plastic events from around the world
          </Heading>
        </Flex>
        <Flex justifyContent={'flex-end'} mb={8}>
          <AuthWrapper>
            <Link to={'/events/create'}>
              <Button variant={'primary'} translateY>
                Create an Event
              </Button>
            </Link>
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          <>
            {upcomingEvents.length === 0 ? null : ( // *** TODO - indicate whether no upcoming events or data still just loading
              <Flex flexWrap={'wrap'} flexDirection="column">
                {upcomingEvents.map((event: IEvent) => (
                  <EventCard event={event} />
                ))}
              </Flex>
            )}
            <Flex justifyContent={'center'} mt={20}>
              <Link to={'#'}>
                <Button variant={'secondary'}>More Events</Button>
              </Link>
            </Flex>
            <MoreContainer
              text={
                'Connect with a likeminded community. All around the planet.'
              }
              buttonVariant={'primary'}
              buttonLabel={'Create an event'}
            />
          </>
        </React.Fragment>
      </>
    )
  }
}
