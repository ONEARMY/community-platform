import ModerationStatusText from 'src/components/ModerationStatusText/ModerationStatustext'
import { Card, Text, Flex, Link } from 'theme-ui'
import { Button, FlagIconEvents } from 'oa-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import type { IEvent } from '../../models/events.models'
import { getMonth, getDay, capitalizeFirstLetter } from 'src/utils/helpers'
import { VerifiedUserBadge } from '../VerifiedUserBadge/VerifiedUserBadge'
import { useTheme } from '@emotion/react'

interface IProps {
  event: IEvent
  needsModeration: boolean
  moderateEvent: (event: IEvent, accepted: boolean) => void
}

export const EventCard = (props: IProps) => {
  const theme = useTheme()
  return (
    <Card mt={4} key={props.event.slug}>
      <Flex
        sx={{
          flex: 1,
          flexDirection: ['column', 'column', 'initial'],
          position: 'relative',
          padding: 3,
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
          <Flex>
            <Text sx={{ width: '100%', ...theme.typography.auxiliary }}>
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
          <Text
            sx={{ width: '100%', ...theme.typography.auxiliary }}
            ml={[1, 1, 2]}
          >
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
          <Link
            href={props.event.url}
            color={'black'}
            target="_blank"
            mr={1}
            sx={{ width: '100%' }}
          >
            <Text
              sx={{
                width: '100%',
                ...theme.typography.auxiliary,
                textAlign: 'right',
              }}
            >
              Go to event
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Card>
  )
}

export default EventCard
