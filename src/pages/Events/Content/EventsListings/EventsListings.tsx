import * as React from 'react'
import type { IEvent, IEventDB } from 'src/models/events.models'
import { Button, MoreContainer } from 'oa-components'
import { Flex, Box, Heading } from 'theme-ui'
import EventCard from '../../EventCard/EventCard'
import TagsSelect from 'src/common/Tags/TagsSelect'
import { inject, observer } from 'mobx-react'
import type { EventStore } from 'src/stores/Events/events.store'
import type { UserStore } from 'src/stores/User/user.store'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import { Link } from 'react-router-dom'
import type { TagsStore } from 'src/stores/Tags/tags.store'

interface InjectedProps {
  eventStore: EventStore
  themeStore: ThemeStore
  tagsStore: TagsStore
  userStore?: UserStore
}

// const filterArrayDuplicates = (array: string[]) => Array.from(new Set(array))

@inject('eventStore', 'userStore', 'themeStore', 'tagsStore')
@observer
export class EventsListings extends React.Component<any> {
  private moderateEvent = async (event: IEvent, accepted: boolean) => {
    event.moderation = accepted ? 'accepted' : 'rejected'
    await this.store.moderateEvent(event)
  }
  get injected() {
    return this.props as InjectedProps
  }

  get store() {
    return this.injected.eventStore
  }

  get theme() {
    return this.injected.themeStore
  }

  public render() {
    const { filteredEvents, upcomingEvents, pastEvents } =
      this.injected.eventStore
    let recentPastEvents: IEventDB[] = []
    if (pastEvents.length > 0) {
      // recentPastEvents = the last 20 past events sorted from latest to oldest
      recentPastEvents = [...pastEvents.slice(-20)]
      recentPastEvents.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    }
    return (
      <>
        {filteredEvents.length === 0 ? ( // *** TODO - indicate whether no upcoming events or data still just loading
          <MoreContainer m={'0 auto'} pt={60} pb={90}>
            <Flex
              sx={{
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
              }}
              mt={5}
            >
              <Heading>At the moment there is no upcoming events</Heading>
              <Link
                to={this.props.userStore!.user ? '/events/create' : 'sign-up'}
              >
                <Button variant="primary" mt={30}>
                  Create an event
                </Button>
              </Link>
            </Flex>
          </MoreContainer>
        ) : (
          // *** TODO - indicate whether no upcoming events or data still just loading
          <>
            <Flex py={26}>
              <Heading
                sx={{
                  marginX: 'auto',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 5,
                }}
              >
                {this.theme.currentTheme.siteName} events from around the world
              </Heading>
            </Flex>
            <Flex
              sx={{
                justifyContent: 'space-between',
                flexDirection: ['column', 'column', 'row'],
                flexWrap: 'nowrap',
              }}
              mb={['20px', 0]}
            >
              <Flex
                sx={{
                  flexWrap: 'nowrap',
                  flexDirection: ['column-reverse', 'column-reverse', 'row'],
                  width: ['100%', '100%', '50%'],
                }}
              >
                <Box
                  sx={{ width: ['100%', '100%', '50%'] }}
                  mb={['10px', '10px', 0]}
                >
                  <TagsSelect
                    onChange={(tags) =>
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
                  sx={{
                    justifyContent: ['flex-end', 'flex-end', 'auto'],
                    width: '100%',
                  }}
                >
                  <Link
                    style={{ width: '100%', display: 'block' }}
                    to={
                      this.props.userStore!.user ? '/events/create' : 'sign-up'
                    }
                  >
                    <Button
                      sx={{ width: '100%' }}
                      variant="primary"
                      data-cy="create-event"
                    >
                      Create an event
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
            <Flex sx={{ flexWrap: 'wrap', flexDirection: 'column' }}>
              {filteredEvents.map((event: IEventDB) => (
                <EventCard
                  key={event._id}
                  event={event}
                  needsModeration={this.store.needsModeration(event)}
                  moderateEvent={this.moderateEvent}
                  tags={
                    event.tags &&
                    Object.keys(event.tags)
                      .map((t) => {
                        return this.injected.tagsStore.allTagsByKey[t]
                      })
                      .filter(Boolean)
                  }
                />
              ))}
            </Flex>
          </>
        )}
        <Flex
          sx={{
            flexWrap: 'wrap',
            flexDirection: 'column',
          }}
        >
          <Heading
            sx={{
              marginX: 'auto',
              marginTop: '55px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 5,
            }}
          >
            Previous events
          </Heading>
          {recentPastEvents.length > 0 ? (
            <>
              {recentPastEvents.map((event: IEventDB) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isPastEvent
                  needsModeration={this.store.needsModeration(event)}
                  moderateEvent={this.moderateEvent}
                  tags={
                    event.tags &&
                    Object.keys(event.tags)
                      .map((t) => {
                        return this.injected.tagsStore.allTagsByKey[t]
                      })
                      .filter(Boolean)
                  }
                />
              ))}
            </>
          ) : (
            <Flex
              sx={{
                alignItems: 'center',
                flexDirection: 'column',
              }}
              mt={5}
            >
              Events not found
            </Flex>
          )}
        </Flex>
        <Flex sx={{ justifyContent: 'center' }} mt={20}>
          <Link to={'#'} style={{ visibility: 'hidden' }}>
            <Button variant={'secondary'} data-cy="more-events">
              More Events
            </Button>
          </Link>
        </Flex>
      </>
    )
  }
}
