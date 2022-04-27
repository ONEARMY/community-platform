import Flex from 'src/components/Flex'
import ModerationStatusText from 'src/components/ModerationStatusText'
import Text from 'src/components/Text'
import { Button } from 'oa-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { FlagIconEvents } from 'oa-components'
import type { IEvent } from '../../models/events.models'
import { getMonth, getDay, capitalizeFirstLetter } from 'src/utils/helpers'
import { LinkTargetBlank } from '../Links/LinkTargetBlank/LinkTargetBlank'
import { VerifiedUserBadge } from '../VerifiedUserBadge/VerifiedUserBadge'

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
    key={props.event.slug}
    sx={{
      flex: 1,
      flexDirection: ['column', 'column', 'initial'],
      position: 'relative',
    }}
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

    <Flex
      mb={[1, 1, 0]}
      sx={{
        order: [1, 1, 1],
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Text
        bold
        sx={{
          display: 'block',
          fontSize: [2, 2, 5],
          textAlign: 'center',
          flex: 2,
        }}
      >
        {getDay(new Date(props.event.date))}
      </Text>
      <Text
        bold
        sx={{
          display: 'block',
          fontSize: [2, 2, 5],
          textAlign: 'center',
        }}
      >
        {getMonth(new Date(props.event.date), 'short')}
      </Text>
    </Flex>
    <Flex
      sx={{
        flexWrap: 'wrap',
        flex: '2',
        order: [3, 3, 2],
      }}
      px={[0, 0, 2]}
      mb={[2, 2, 0]}
    >
      <Flex sx={{ alignItems: 'center', width: '100%' }}>
        <Text bold color="black" sx={{ fontSize: [3, 3, 4] }}>
          {capitalizeFirstLetter(props.event.title)}
        </Text>
      </Flex>
      <Flex>
        <Text auxiliary sx={{ width: '100%' }}>
          By {props.event._createdBy}
        </Text>
        <VerifiedUserBadge
          userId={props.event._createdBy}
          width="16px"
          height="16px"
        />
      </Flex>
    </Flex>
    <Flex
      sx={{
        alignItems: 'center',
        flexWrap: 'nowrap',
        flex: 1,
        order: [2, 2, 3],
      }}
      mb={[2, 2, 0]}
    >
      <FlagIconEvents code={props.event.location.countryCode} />
      <Text auxiliary sx={{ width: '100%' }} ml={[1, 1, 2]}>
        {[
          props.event.location.administrative,
          props.event.location?.countryCode?.toUpperCase(),
        ]
          .filter(Boolean)
          .join(', ')}
      </Text>
    </Flex>
    <Flex
      sx={{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'column',
        order: [4, 4, 4],
      }}
      mb={[2, 2, 0]}
    >
      {props.event.tags &&
        Object.keys(props.event.tags).map((tag) => {
          return <TagDisplay key={tag} tagKey={tag} />
        })}
    </Flex>
    {props.needsModeration && (
      <Flex
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'nowrap',
          order: [5, 5, 5],
        }}
        ml={2}
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
      sx={{
        alignItems: 'center',
        flexWrap: 'nowrap',
        flex: 1,
        order: [5, 5, 5],
      }}
    >
      <LinkTargetBlank
        href={props.event.url}
        color={'black'}
        mr={1}
        sx={{ width: '100%' }}
      >
        <Text auxiliary sx={{ width: '100%' }} txtRight>
          Go to event
        </Text>
      </LinkTargetBlank>
    </Flex>
  </Flex>
)

export default EventCard
