import * as React from 'react'
import { IEvent } from 'src/models/events.models'
import './EventsList.scss'
import * as Mocks from 'src/mocks/events.mock'
import { Button } from 'src/components/Button'
import { EventStore } from 'src/stores/Events/events.store'
import { Link } from 'src/components/Links'
import { Flex, Box, Link as ExternalLink } from 'rebass'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { LinearProgress } from '@material-ui/core'
import Text from 'src/components/Text'
import styled from 'styled-components'
import { colors } from 'src/themes/styled.theme'
import Icon from 'src/components/Icons'
import { TagDisplay } from 'src/components/Tags/TagDisplay/TagDisplay'

interface IState {
  events: IEvent[]
}

interface IProps {
  eventStore: EventStore
}

const RowContainer = styled(Flex)`
  border-bottom: 1px solid ${colors.grey4};
`

export class EventsList extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    // initial state
    this.state = { events: Mocks.EVENTS }
  }
  public formatDate(d: Date) {
    return `${Mocks.MONTHS[d.getMonth()]} ${d.getDay()}`
  }
  public showMap() {
    this.props.eventStore.setEventView('map')
  }

  public render() {
    const { events } = this.state
    return (
      <>
        <Flex justifyContent={'right'}>
          <AuthWrapper>
            <Link to={'/events/create'}>
              <Button variant="outline" icon={'add'}>
                create
              </Button>
            </Link>
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          <>
            {events.length === 0 ? (
              <LinearProgress />
            ) : (
              <Flex
                bg={'white'}
                className="list-container"
                flexWrap={'wrap'}
                mt={4}
                px={4}
              >
                {events.map((event: IEvent) => (
                  <RowContainer width={1} py={4}>
                    <Flex flexWrap={'wrap'} flex={'1'}>
                      <Text large bold width={1}>
                        June
                      </Text>
                      <Text large bold width={1}>
                        1
                      </Text>
                    </Flex>
                    <Flex flexWrap={'wrap'} flex={'3'}>
                      <Text large width={1}>
                        {event.title}
                      </Text>
                      <Text py={2} small width={1}>
                        by{' '}
                        <Text inline bold>
                          {' '}
                          {event._createdBy}
                        </Text>
                      </Text>
                    </Flex>
                    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'2'}>
                      <Icon glyph={'location-on'} />
                      <Text large bold width={1} ml={2}>
                        {event.location.name},{' '}
                        <Text caps inline>
                          {event.location.countryCode}
                        </Text>
                      </Text>
                    </Flex>
                    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'2'}>
                      {event.tags &&
                        Object.keys(event.tags).map(tag => {
                          return <TagDisplay key={tag} tagKey={tag} />
                        })}
                    </Flex>
                    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
                      <ExternalLink
                        target="_blank"
                        href={event.url}
                        color={'black'}
                        mr={1}
                      >
                        <Text small>Go to Event Page</Text>
                      </ExternalLink>
                      <Icon glyph={'external-link'} />
                    </Flex>
                  </RowContainer>
                ))}
              </Flex>
            )}
          </>
        </React.Fragment>
      </>
    )
  }
}
