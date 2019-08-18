import * as React from 'react'
import { IEvent } from 'src/models/events.models'
import { Link } from 'src/components/Links'
import { Flex, Link as ExternalLink, Button } from 'rebass'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import Text from 'src/components/Text'
import styled from 'styled-components'
import theme from 'src/themes/styled.preciousplastic'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'
import ImageTargetBlank from 'src/assets/icons/link-target-blank.svg'
import MoreElementsButton from 'src/components/MoreLinks/MoreElementsButton'
import MoreDirectionModal from 'src/components/MoreLinks/MoreDirectionModal'
import ListPageTitle from 'src/components/Titles/ListPageTitle'

interface IProps {
  upcomingEvents: IEvent[]
}

const RowContainer = styled(Flex)`
  border: 2px solid ${theme.colors.black};
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
        <ListPageTitle
          pageTitle={'Precious Plastic events from around the world'}
        />
        <Flex justifyContent={'flex-end'} mb={8}>
          <AuthWrapper>
            <Link to={'/events/create'}>
              <Button variant={'primary'}>Create an Event</Button>
            </Link>
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          <>
            {upcomingEvents.length === 0 ? null : ( // *** TODO - indicate whether no upcoming events or data still just loading
              <Flex flexWrap={'wrap'} flexDirection="column">
                {upcomingEvents.map((event: IEvent) => (
                  <RowContainer
                    bg="white"
                    px={3}
                    mt={4}
                    py={3}
                    flex={1}
                    key={event._id}
                    flexDirection={['column', 'initial']}
                  >
                    <Flex flexWrap={'wrap'} flex={'1'}>
                      <Text txtcenter xlarge bold width={1}>
                        {this.getDay(event.date as Date)}
                      </Text>
                      <Text txtcenter xlarge bold width={1}>
                        {this.getMonth(event.date as Date)}
                      </Text>
                    </Flex>
                    <Flex flexWrap={'wrap'} flex={'2'} px={4}>
                      <Text xlarge color="black" width={1}>
                        {event.title}
                      </Text>
                      <Text small capitalize color="grey" width={1}>
                        By{' '}
                        <Text inline capitalize>
                          {event._createdBy}
                        </Text>
                      </Text>
                    </Flex>
                    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
                      <FlagIconEvents code={event.location.countryCode} />
                      <Text small color="grey" width={1} ml={2}>
                        {event.location.name},{' '}
                        <Text uppercase inline>
                          {event.location.countryCode}
                        </Text>
                      </Text>
                    </Flex>
                    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
                      {event.tags &&
                        Object.keys(event.tags).map(tag => {
                          return <TagDisplay key={tag} tagKey={tag} />
                        })}
                    </Flex>
                    <Flex flexWrap={'nowrap'} alignItems={'center'} flex={'1'}>
                      <GoToEventLink
                        target="_blank"
                        href={event.url}
                        color={'black'}
                        mr={1}
                        width={1}
                      >
                        <Text small txtright width={1}>
                          Go to event
                        </Text>
                      </GoToEventLink>
                    </Flex>
                  </RowContainer>
                ))}
              </Flex>
            )}
            <MoreElementsButton
              buttonLink={'#'}
              buttonLabel={'More events'}
              buttonVariant={'secondary'}
            />
            <MoreDirectionModal
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
