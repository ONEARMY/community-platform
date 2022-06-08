import * as React from 'react'
import type { IEvent, IEventDB } from 'src/models/events.models'
import { Button } from 'oa-components'
import { Flex, Box, Link, Heading } from 'theme-ui'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import EventCard from 'src/pages/Events/EventCard/EventCard'
import TagsSelect from 'src/components/Tags/TagsSelect'
import { inject, observer } from 'mobx-react'
import type { EventStore } from 'src/stores/Events/events.store'
import type { UserStore } from 'src/stores/User/user.store'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

interface InjectedProps {
  eventStore: EventStore
  themeStore: ThemeStore
  userStore?: UserStore
}

// const filterArrayDuplicates = (array: string[]) => Array.from(new Set(array))

@inject('eventStore', 'userStore', 'themeStore')
@observer
export class EventsList extends React.Component<any> {
  get injected() {
    return this.props as InjectedProps
  }

  get store() {
    return this.injected.eventStore
  }

  get theme() {
    return this.injected.themeStore
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
                  sx={{ width: '100%', display: 'block' }}
                  href={
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
          <React.Fragment>
            <>
              {filteredEvents.length === 0 ? null : ( // *** TODO - indicate whether no upcoming events or data still just loading
                <Flex sx={{ flexWrap: 'wrap', flexDirection: 'column' }}>
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
              <Flex sx={{ justifyContent: 'center' }} mt={20}>
                <Link href={'#'} style={{ visibility: 'hidden' }}>
                  <Button variant={'secondary'} data-cy="more-events">
                    More Events
                  </Button>
                </Link>
              </Flex>
              <MoreContainer m={'0 auto'} pt={60} pb={90}>
                <Flex
                  sx={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                  mt={5}
                >
                  <Heading>Connect with a likeminded community.</Heading>
                  <Heading>All around the planet.</Heading>
                  <Link
                    href={
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
