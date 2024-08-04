import { useNavigate } from '@remix-run/react'

import { Button } from '../Button/Button'
import { Tooltip } from '../Tooltip/Tooltip'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  hasUserSubscribed: boolean
  isLoggedIn: boolean
  onFollowClick: () => void
  sx?: ThemeUIStyleObject
}

export const FollowButton = (props: IProps) => {
  const { hasUserSubscribed, isLoggedIn, onFollowClick, sx } = props
  const navigate = useNavigate()

  return (
    <>
      <Button
        type="button"
        data-testid={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-cy={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-tip={isLoggedIn ? '' : 'Login to follow'}
        icon="thunderbolt"
        variant="outline"
        iconColor={hasUserSubscribed ? 'subscribed' : 'notSubscribed'}
        sx={{
          fontSize: 2,
          py: 0,
          ...sx,
        }}
        onClick={() => (isLoggedIn ? onFollowClick() : navigate('/sign-in'))}
      >
        {hasUserSubscribed ? 'Following' : 'Follow'}
      </Button>
      <Tooltip />
    </>
  )
}
