import Flex from 'src/components/Flex'
import ModerationStatusText from 'src/components/ModerationStatusText'
import Text from 'src/components/Text'
import { Button } from 'src/components/Button'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'
import { IEvent } from '../../models/events.models'
import { getMonth, getDay, capitalizeFirstLetter } from 'src/utils/helpers'
import { LinkTargetBlank } from '../Links/LinkTargetBlank/LinkTargetBlank'

interface IProps {
  event: IEvent
  needsModeration: boolean
  moderateEvent: (event: IEvent, accepted: boolean) => void
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
    key={props.event.slug}
    flexDirection={['column', 'column', 'initial']}
    sx={{ position: 'relative' }}
    data-cy="card"
    data-eventid={props.event._id}
  >
    {props.event.moderation !== 'accepted' && (
      <ModerationStatusText
        moderatedContent={props.event}
        contentType="event"
        top={'0px'}
      />
    )}

    <Flex flexWrap={'wrap'} flex={'1'} mb={[1, 1, 0]} order={[1, 1, 1]}>
      <Flex
        alignItems={['center', 'center', 'center']}
        width={['auto', 'auto', 1]}
        mr={[1, 1, 0]}
      >
        <Text
          bold
          fontSize={[2, 2, 5]}
          textAlign={'center'}
          width={['auto', 'auto', 1]}
        >
          {getDay(new Date(props.event.date))}
        </Text>
      </Flex>
      <Flex
        alignItems={['center', 'center', 'center']}
        width={['auto', 'auto', 1]}
      >
        <Text
          bold
          fontSize={[2, 2, 5]}
          textAlign={'center'}
          width={['auto', 'auto', 1]}
        >
          {getMonth(new Date(props.event.date), 'short')}
        </Text>
      </Flex>
    </Flex>
    <Flex
      flexWrap={'wrap'}
      flex={'2'}
      px={[0, 0, 2]}
      order={[3, 3, 2]}
      mb={[2, 2, 0]}
    >
      <Flex alignItems={'center'} width={1}>
        <Text bold color="black" fontSize={[3, 3, 4]}>
          {capitalizeFirstLetter(props.event.title)}
        </Text>
      </Flex>
      <Text auxiliary width={1}>
        By {props.event._createdBy}
      </Text>
    </Flex>
    <Flex
      flexWrap={'nowrap'}
      alignItems={'center'}
      flex={'1'}
      order={[2, 2, 3]}
      mb={[2, 2, 0]}
    >
      <FlagIconEvents code={props.event.location.countryCode} />
      <Text auxiliary width={1} ml={[1, 1, 2]}>
        {props.event.location.name},{' '}
        <Text inline auxiliary uppercase>
          {props.event.location.countryCode}
        </Text>
      </Text>
    </Flex>
    <Flex
      flex="1"
      alignItems="flex-start"
      justifyContent="center"
      flexDirection="column"
      order={[4, 4, 4]}
      mb={[2, 2, 0]}
    >
      {props.event.tags &&
        Object.keys(props.event.tags).map(tag => {
          return <TagDisplay key={tag} tagKey={tag} />
        })}
    </Flex>
    {props.needsModeration && (
      <Flex
        flexWrap={'nowrap'}
        flexDirection={'row'}
        alignItems={'center'}
        ml={2}
        order={[5, 5, 5]}
      >
        <Button
          small
          data-cy={'accept'}
          variant={'primary'}
          icon="check"
          mr={1}
          sx={{ height: '30px' }}
          onClick={() => props.moderateEvent(props.event, true)}
        />
        <Button
          small
          data-cy="reject-pin"
          variant={'tertiary'}
          icon="delete"
          sx={{ height: '30px' }}
          onClick={() => props.moderateEvent(props.event, false)}
        />
      </Flex>
    )}
    <Flex
      flexWrap={'nowrap'}
      alignItems={'center'}
      flex={'1'}
      order={[5, 5, 5]}
    >
      <LinkTargetBlank href={props.event.url} color={'black'} mr={1} width={1}>
        <Text auxiliary width={1} txtRight>
          Go to event
        </Text>
      </LinkTargetBlank>
    </Flex>
  </Flex>
)

export default EventCard
