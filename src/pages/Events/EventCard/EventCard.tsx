import { Card, Text, Flex, Image } from 'theme-ui'
import {
  Button,
  FlagIconEvents,
  ExternalLink,
  ModerationStatus,
  CategoryTag,
  Username,
} from 'oa-components'
import type { IEvent } from '../../../models/events.models'
import { getMonth, getDay, capitalizeFirstLetter } from 'src/utils/helpers'
import laptopIcon from 'src/assets/icons/icon-laptop.png'
import { isUserVerified } from 'src/common/isUserVerified'

interface IProps {
  event: IEvent
  isPastEvent?: boolean
  needsModeration: boolean
  moderateEvent: (event: IEvent, accepted: boolean) => void
  tags:
    | {
        label: string
      }[]
    | undefined
}

export const EventCard = (props: IProps) => {
  return (
    <Card mt={4} key={props.event.slug}>
      <Flex
        sx={{
          flex: 1,
          flexDirection: ['column', 'column', 'initial'],
          position: 'relative',
          padding: 3,
          opacity: props.isPastEvent ? '0.6' : null,
        }}
        data-cy="card"
        data-eventid={props.event._id}
      >
        {props.event.moderation !== 'accepted' && (
          <ModerationStatus
            status={props.event.moderation}
            contentType="event"
            sx={{ top: 0, position: 'absolute', right: 0 }}
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
            sx={{
              display: 'block',
              fontSize: [2, 2, 5],
              fontWeight: 'bold',
              textAlign: 'center',
              flex: 2,
            }}
          >
            {getDay(new Date(props.event.date))}
          </Text>
          <Text
            sx={{
              display: 'block',
              fontSize: [2, 2, 5],
              fontWeight: 'bold',
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
          mb={[2, 2, 0]}
        >
          <Flex sx={{ alignItems: 'center', width: '100%' }}>
            <Text
              color="black"
              sx={{ fontSize: [3, 3, 4], fontWeight: 'bold' }}
            >
              {capitalizeFirstLetter(props.event.title)}
            </Text>
          </Flex>
          <div>
            <Username
              user={{
                userName: props.event._createdBy,
                countryCode: '',
              }}
              isVerified={isUserVerified(props.event._createdBy)}
            />
          </div>
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
          {props.event?.isDigital ? (
            <>
              <Image src={laptopIcon} alt="" width="36px" />
              <Text variant="auxiliary" sx={{ width: '100%' }} ml={[1, 1, 2]}>
                Digital
              </Text>
            </>
          ) : (
            <>
              <FlagIconEvents code={props.event.location.countryCode} />
              <Text variant="auxiliary" sx={{ width: '100%' }} ml={[1, 1, 2]}>
                {[
                  props.event.location.administrative,
                  props.event.location?.countryCode?.toUpperCase(),
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </>
          )}
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
          {props.tags?.map((t, idx) => t && <CategoryTag key={idx} tag={t} />)}
        </Flex>
        {props.needsModeration && (
          <Flex
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'nowrap',
              order: [5, 5, 5],
            }}
            mx={2}
          >
            <Button
              small
              data-cy={'accept'}
              variant={'primary'}
              icon="check"
              mr={1}
              sx={{ height: '30px' }}
              showIconOnly={true}
              onClick={() => props.moderateEvent(props.event, true)}
            >
              Approve
            </Button>
            <Button
              small
              data-cy="reject-pin"
              variant={'outline'}
              showIconOnly={true}
              icon="delete"
              sx={{ height: '30px' }}
              onClick={() => props.moderateEvent(props.event, false)}
            >
              Reject
            </Button>
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
          <ExternalLink
            href={props.event.url}
            color={'black'}
            mr={1}
            sx={{ width: '100%' }}
          >
            <Text
              variant="auxiliary"
              sx={{
                width: '100%',
                textAlign: 'right',
              }}
            >
              Go to event
            </Text>
          </ExternalLink>
        </Flex>
      </Flex>
    </Card>
  )
}

export default EventCard
