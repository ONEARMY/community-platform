import { Box, Card, Text, Image, AspectRatio } from 'theme-ui'
import { formatDistanceToNow } from 'date-fns'

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
  }
  heading: string
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
  const pin = {
    type: 'member',
    moderation: 'accepted',
  }
  const moderationStatus = 'fish'

  return (
    <Card sx={{ maxWidth: '230px' }}>
      <InternalLink to={`/u/${user.username}`}>
        {props.loading && (
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
                  ? `${formatDistanceToNow(new Date(lastActive))}`
                  : 'a long time'}{' '}
                ago
              </Text>
              {pin.moderation !== 'accepted' && (
                <Text
                  mb={2}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 1,
                    background: 'yellow.base',
                    padding: '7px',
                    borderRadius: '5px',
                    border: '1px dashed',
                    color: pin.moderation === 'rejected' ? 'red' : null,
                  }}
                >
                  {moderationStatus}
                </Text>
              )}
            </Box>
          </>
        )}
      </InternalLink>
    </Card>
  )
}
