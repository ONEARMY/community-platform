import * as React from 'react'
import { IEvent, IEventDB } from 'src/models/events.models'
import { Button } from 'src/components/Button'
import { Link } from 'src/components/Links'
import { Flex, Link as ExternalLink, Box } from 'rebass'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import Heading from 'src/components/Heading'
import EventCard from 'src/components/EventCard/EventCard'
import TagsSelect from 'src/components/Tags/TagsSelect'
import { inject, observer } from 'mobx-react'
import { EventStore } from 'src/stores/Events/events.store'
import { LocationSearch } from 'src/components/LocationSearch/LocationSearch'

interface InjectedProps {
  eventStore: EventStore
}

interface IState {
  eventsOffset: number
}

const getLimitedEvents = (start: number, end: number, array: IEventDB[]) =>
  array.slice(start, end)
const eventsLimit = 5

@inject('eventStore')
@observer
export class EventsList extends React.Component<any, IState> {
  constructor(props: any) {
    super(props),
      (this.state = {
        eventsOffset: 0,
      })
  }

  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    let { filteredEvents } = this.injected.eventStore

    const allEventsLength = filteredEvents.length
    filteredEvents = getLimitedEvents(
      0,
      this.state.eventsOffset + eventsLimit,
      filteredEvents,
    )

    const showMoreEvents =
      this.state.eventsOffset + eventsLimit < allEventsLength ? true : false

    if (filteredEvents) {
      return (
        <>
          <Flex py={26}>
            <Heading medium txtcenter bold width={1} my={20}>
              Precious Plastic events from around the world
            </Heading>
          </Flex>
          <Flex justifyContent={'space-between'}>
            <Flex flexWrap={'nowrap'} width={[1, 1, 0.5]}>
              <Box width={0.5}>
                <TagsSelect
                  onChange={tags =>
                    this.props.eventStore.updateSelectedTags(tags)
                  }
                  category="event"
                  styleVariant="filter"
                />
              </Box>
              <Box width={0.5} ml={2} className="location-search-list">
                <LocationSearch
                  onChange={v =>
                    this.props.eventStore.updateSelectedLocation(v)
                  }
                  onClear={() => this.props.eventStore.clearLocationSearch()}
                  styleVariant="filter"
                />
              </Box>
            </Flex>
            <Flex>
              <AuthWrapper>
                <Link to={'/events/create'}>
                  <Button variant="primary">Create an event</Button>
                </Link>
              </AuthWrapper>
            </Flex>
          </Flex>
          <React.Fragment>
            <>
              {filteredEvents.length === 0 ? null : (
                // THIS IS TO BE TESTED AND UNCOMMENTED ONCE #670 IS MERGED
                // ( // if there are no events to show, there will be no tags to select
                //   <Flex flexWrap={'wrap'} flexDirection="column">
                //     <Heading auxiliary txtcenter width={1}>
                //     {
                //       uniqueUsedTags.length === 0
                //     ? 'No events to show'
                //     : 'Loading...'}
                //     </Heading>
                //   </Flex>
                // )
                <Flex flexWrap={'wrap'} flexDirection="column">
                  {filteredEvents.map((event: IEventDB) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </Flex>
              )}
              {showMoreEvents && (
                <Flex justifyContent={'center'} mt={20}>
                  <Link to={'#'}>
                    <Button
                      variant={'secondary'}
                      onClick={(evt: any) => {
                        evt.preventDefault()
                        this.setState({
                          eventsOffset: this.state.eventsOffset + eventsLimit,
                        })
                      }}
                    >
                      More Events
                    </Button>
                  </Link>
                </Flex>
              )}
              <MoreContainer m={'0 auto'} pt={60} pb={90}>
                <Flex alignItems={'center'} flexDirection={'column'} mt={5}>
                  <Heading medium>Connect with a likeminded community.</Heading>
                  <Heading medium>All around the planet.</Heading>
                  <AuthWrapper>
                    <Link to={'/events/create'}>
                      <Button variant="primary" mt={30}>
                        Create an event
                      </Button>
                    </Link>
                  </AuthWrapper>
                </Flex>
              </MoreContainer>
            </>
          </React.Fragment>
        </>
      )
    } else {
      return <div>Events not found</div>
    }
  }
}
