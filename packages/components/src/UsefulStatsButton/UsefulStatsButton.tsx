import { useState } from 'react'
import { useTheme } from '@emotion/react'
import { useNavigate } from '@remix-run/react'
import { Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { Tooltip } from '../Tooltip/Tooltip'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  hasUserVotedUseful: boolean
  votedUsefulCount: number | undefined
  isLoggedIn: boolean
  onUsefulClick: () => Promise<void>
  sx?: ThemeUIStyleObject
}

export const UsefulStatsButton = (props: IProps) => {
  const theme: any = useTheme()
  const navigate = useNavigate()

  const [disabled, setDisabled] = useState<boolean>()

  const handleUsefulClick = async () => {
    setDisabled(true)
    try {
      await props.onUsefulClick()
    } catch (err) {
      // do nothing
    }
    setDisabled(false)
  }

  return (
    <>
      <Button
        type="button"
        data-tip={props.isLoggedIn ? '' : 'Login to add your vote'}
        data-cy={props.isLoggedIn ? 'vote-useful' : 'vote-useful-redirect'}
        onClick={() =>
          props.isLoggedIn ? handleUsefulClick() : navigate('/sign-in')
        }
        disabled={disabled}
        sx={{
          fontSize: 2,
          backgroundColor: theme.colors.white,
          py: 0,
          '&:hover': {
            backgroundColor: theme.colors.softblue,
          },
          ...props.sx,
        }}
        icon={props.hasUserVotedUseful ? 'star' : 'star-active'}
      >
        <Text
          pr={2}
          py={2}
          sx={{
            display: 'inline-block',
          }}
        >
          {props.votedUsefulCount}
        </Text>
        <Text
          pl={2}
          py={2}
          sx={{
            display: 'inline-block',
            borderLeft: `1px solid ${theme.colors.black}`,
          }}
        >
          {props.hasUserVotedUseful ? 'Marked as useful' : 'Mark as useful'}
        </Text>
      </Button>
      <Tooltip />
    </>
  )
}
