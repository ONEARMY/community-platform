import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Tooltip } from '..'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  hasUserSubscribed: boolean
  isLoggedIn: boolean
  onFollowClick: () => void
  sx?: ThemeUIStyleObject
}

export const FollowButton = (props: IProps) => {
  const navigate = useNavigate()
  const [hasUserSubscribed, setHasUserSubscribed] = useState<boolean>()

  useEffect(
    () => setHasUserSubscribed(props.hasUserSubscribed),
    [props.hasUserSubscribed],
  )

  return (
    <>
      <Button
        data-testid={props.isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-cy={props.isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-tip={props.isLoggedIn ? '' : 'Login to follow'}
        icon="thunderbolt"
        variant="outline"
        iconColor={hasUserSubscribed ? 'subscribed' : 'notSubscribed'}
        sx={{
          fontSize: 2,
          py: 0,
        }}
        onClick={() =>
          props.isLoggedIn ? props.onFollowClick() : navigate('/sign-in')
        }
      >
        {hasUserSubscribed ? 'Following' : 'Follow'}
      </Button>
      <Tooltip />
    </>
  )
}
