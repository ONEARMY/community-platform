import { Box, Card, Text, Image, AspectRatio, Alert } from 'theme-ui'
import { Username } from '../Username/Username'

export interface Props {
  loading?: boolean
  imageUrl: string
  description: string
  comments: string | null
  user: {
    isVerified: boolean
    username: string
    country: string | null
  }
  heading: string
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
  const { imageUrl, description, user, heading, comments } = props
  return (
    <Card sx={{ maxWidth: '230px' }} data-cy="MapMemberCard">
      <Box>
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

              {comments ? (
                <Alert
                  variant="info"
                  sx={{ fontSize: 1, textAlign: 'left' }}
                  data-testid="MapMemberCard: moderation comments"
                >
                  <Box>
                    This map pin has been marked as requiring further changes.
                    <Box>{comments}</Box>
                  </Box>
                </Alert>
              ) : null}
            </Box>
          </>
        )}
      </Box>
    </Card>
  )
}
