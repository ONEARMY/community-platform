import * as React from 'react'
import { IEvent } from 'src/models/events.models'
import { Button } from 'src/components/Button'
import { Link } from 'src/components/Links'
import { Flex, Link as ExternalLink } from 'rebass'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import Text from 'src/components/Text'
import styled from 'styled-components'
import { colors } from 'src/themes/styled.theme'
import Icon from 'src/components/Icons'
import { TagDisplay } from 'src/components/Tags/TagDisplay/TagDisplay'
import Heading from 'src/components/Heading'

interface IProps {
  upcomingEvents: IEvent[]
}

const RowContainer = styled(Flex)`
  border-bottom: 1px solid ${colors.grey4};
`

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
            {upcomingEvents.length === 0 ? null : ( // *** TODO - indicate whether no upcoming events or data still just loading
              <Flex
                bg={'white'}
                className="list-container"
                flexWrap={'wrap'}
                mt={4}
                px={4}
              >
                {upcomingEvents.map((event: IEvent) => (
                  <RowContainer width={1} py={4} key={event._id}>
                    <Flex flexWrap={'wrap'} flex={'1'}>
                      <Text large bold width={1}>
                        {this.getMonth(new Date(event.date))}
                      </Text>
                      <Heading small bold width={1}>
                        {this.getDay(new Date(event.date))}
                      </Heading>
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
                      <Text large width={1} ml={2}>
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
