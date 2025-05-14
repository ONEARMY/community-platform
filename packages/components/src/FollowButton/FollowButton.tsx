import { useMemo } from 'react'
import { useNavigate } from '@remix-run/react'

import { Button } from '../Button/Button'
import { Tooltip } from '../Tooltip/Tooltip'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  hasUserSubscribed: boolean
  isLoggedIn: boolean
  onFollowClick: () => void
  label?: string
  sx?: ThemeUIStyleObject
}

export const FollowButton = (props: IProps) => {
  const { hasUserSubscribed, isLoggedIn, label, onFollowClick, sx } = props
  const navigate = useNavigate()
  const uuid = useMemo(() => (Math.random() * 16).toString(), [])

  return (
    <>
      <Button
        type="button"
        data-testid={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-cy={isLoggedIn ? 'follow-button' : 'follow-redirect'}
        data-tooltip-id={uuid}
        data-tooltip-content={isLoggedIn ? '' : 'Login to follow'}
        variant="outline"
        sx={{
          fontSize: 2,
          py: 0,
          ...sx,
        }}
        onClick={() =>
          isLoggedIn
            ? onFollowClick()
            : navigate(
                '/sign-in?returnUrl=' + encodeURIComponent(location.pathname),
              )
        }
        icon={hasUserSubscribed ? 'thunderbolt' : 'thunderbolt-grey'}
      >
        {hasUserSubscribed ? 'Following' : label || 'Follow'}
      </Button>
      <Tooltip id={uuid} />
    </>
  )
}
