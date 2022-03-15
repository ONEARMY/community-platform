import * as React from 'react'
import { IEvent, IEventDB } from 'src/models/events.models'
import { Button } from 'oa-components'
import { Link } from 'src/components/Links'
import { Flex, Box } from 'rebass'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import Heading from 'src/components/Heading'
import EventCard from 'src/components/EventCard/EventCard'
import TagsSelect from 'src/components/Tags/TagsSelect'
import { inject, observer } from 'mobx-react'
import { EventStore } from 'src/stores/Events/events.store'
import { UserStore } from 'src/stores/User/user.store'

interface InjectedProps {
  eventStore: EventStore
  userStore?: UserStore
}

// const filterArrayDuplicates = (array: string[]) => Array.from(new Set(array))

@inject('eventStore', 'userStore')
@observer
export class EventsList extends React.Component<any> {
  get injected() {
    return this.props as InjectedProps
  }

  get store() {
    return this.injected.eventStore
  }

  private moderateEvent = async (event: IEvent, accepted: boolean) => {
    event.moderation = accepted ? 'accepted' : 'rejected'
    await this.store.moderateEvent(event)
  }

  public render() {
    const { filteredEvents, upcomingEvents } = this.injected.eventStore
    if (filteredEvents) {
      return (
        <>
          <Flex py={26}>
            <Heading medium txtcenter bold width={1}>
              Precious Plastic events from around the world
            </Heading>
          </Flex>
          <Flex
            flexWrap={'nowrap'}
            justifyContent={'space-between'}
            flexDirection={['column', 'column', 'row']}
            mb={['20px', 0]}
          >
            <Flex
              flexWrap={'nowrap'}
              flexDirection={['column-reverse', 'column-reverse', 'row']}
              width={[1, 1, 0.5]}
            >
              <Box width={[1, 1, 0.5]} mb={['10px', '10px', 0]}>
                <TagsSelect
                  onChange={tags =>
                    this.props.eventStore.updateSelectedTags(tags)
                  }
                  category="event"
                  styleVariant="filter"
                  relevantTagsItems={upcomingEvents}
                />
              </Box>
            </Flex>
            <Flex>
              <Flex
                justifyContent={['flex-end', 'flex-end', 'auto']}
                width="100%"
              >
                <Link
                  width="100%"
                  to={this.props.userStore!.user ? '/events/create' : 'sign-up'}
                >
                  <Button width="100%" variant="primary" data-cy="create-event">
                    Create an event
                  </Button>
                </Link>
              </Flex>
            </Flex>
          </Flex>
          <React.Fragment>
            <>
              {filteredEvents.length === 0 ? null : ( // *** TODO - indicate whether no upcoming events or data still just loading
                <Flex flexWrap={'wrap'} flexDirection="column">
                  {filteredEvents.map((event: IEventDB) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      needsModeration={this.store.needsModeration(event)}
                      moderateEvent={this.moderateEvent}
                    />
                  ))}
                </Flex>
              )}
              <Flex justifyContent={'center'} mt={20}>
                <Link to={'#'} style={{ visibility: 'hidden' }}>
                  <Button variant={'secondary'} data-cy="more-events">
                    More Events
                  </Button>
                </Link>
              </Flex>
              <MoreContainer m={'0 auto'} pt={60} pb={90}>
                <Flex alignItems={'center'} flexDirection={'column'} mt={5}>
                  <Heading medium sx={{ textAlign: 'center' }}>
                    Connect with a likeminded community.
                  </Heading>
                  <Heading medium>All around the planet.</Heading>
                  <Link
                    to={
                      this.props.userStore!.user ? '/events/create' : 'sign-up'
                    }
                  >
                    <Button variant="primary" mt={30}>
                      Create an event
                    </Button>
                  </Link>
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
