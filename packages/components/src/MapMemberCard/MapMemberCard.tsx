import { Box, Card, Flex, Text, Image, AspectRatio, Alert } from 'theme-ui'
import { Button } from '../Button/Button'
import { formatDistanceToNowStrict } from 'date-fns'

import { InternalLink } from '../InternalLink/InternalLink'
import { Username } from '../Username/Username'

export interface Props {
  loading?: boolean
  imageUrl: string
  lastActive: string
  description: string
  user: {
    isVerified: boolean
    username: string
    country: string | null
  }
  heading: string
  moderationStatus: string
  onPinModerated?: (isPinApproved: boolean) => void
  isEditable: boolean
}

import { keyframes } from '@emotion/react'

const wave = keyframes`
  from {
    background: lightgrey;
  }
  to {
    background: grey;
  }
`

export const MapMemberCard = (props: Props) => {
  const { imageUrl, lastActive, description, user, heading } = props
  const moderationStatusMsg =
    props.moderationStatus !== 'rejected'
      ? 'This pin is awaiting moderation, it will be shown on general map once accepted.'
      : 'This pin has been rejected, it will not show on general map.'
  const pin = {
    type: 'member',
    moderation: props.moderationStatus,
  }

  const onPinModerated = props.onPinModerated

  return (
    <Card sx={{ maxWidth: '230px' }} data-cy="MapMemberCard">
      <InternalLink to={`/u/${user.username}`}>
        {!!props.loading && (
          <>
            <AspectRatio
              ratio={230 / 120}
              sx={{
                background: 'lightgrey',
                animation: `${wave} 800ms ease infinite`,
              }}
            />
            <Box sx={{ p: 2, height: '109px' }} />
          </>
        )}
        {!props.loading && (
          <>
            <AspectRatio
              ratio={230 / 120}
              sx={{
                background: 'lightgrey',
              }}
            >
              <Image
                src={imageUrl}
                sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </AspectRatio>
            <Box sx={{ p: 2 }}>
              <Text mb={2} sx={{ fontSize: '12px', color: 'blue' }}>
                {heading}
              </Text>
              <div>
                <Username
                  isVerified={!!user.isVerified}
                  user={{
                    userName: user.username,
                    countryCode: user.country,
                  }}
                />
              </div>
              <Text
                mb={2}
                sx={{
                  wordBreak: 'break-word',
                  fontSize: 1,
                  display: 'block',
                  color: 'black',
                }}
              >
                {description}
              </Text>
              <Text
                sx={{
                  fontSize: 0,
                  color: 'grey',
                }}
              >
                Last active{' '}
                {lastActive
                  ? `${formatDistanceToNowStrict(new Date(lastActive))}`
                  : 'a long time'}{' '}
                ago
              </Text>
            </Box>
          </>
        )}
        {pin.moderation !== 'accepted' && (
          <Alert
            mb={2}
            data-cy="MapMemberCard: moderation status"
            variant={pin.moderation === 'rejected' ? 'failure' : 'info'}
            sx={{
              mx: 2,
              fontSize: 1,
              textAlign: 'left',
              padding: 2,
            }}
          >
            {moderationStatusMsg}
          </Alert>
        )}
      </InternalLink>
      {props.isEditable && (
        <Flex
          sx={{
            m: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Button
            small
            data-cy="MapMemberCard: accept"
            variant={'primary'}
            icon="check"
            onClick={() => onPinModerated && onPinModerated(true)}
          >
            Approve
          </Button>
          <Button
            small
            data-cy="MapMemberCard: reject"
            variant={'outline'}
            icon="delete"
            onClick={() => onPinModerated && onPinModerated(false)}
          >
            Reject
          </Button>
        </Flex>
      )}
    </Card>
  )
}
