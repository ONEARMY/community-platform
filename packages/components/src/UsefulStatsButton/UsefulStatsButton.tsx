import { useTheme } from '@emotion/react'
import { useEffect, useState } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'
import { Text } from 'theme-ui'
import { Button, Tooltip } from '../'
import { useHistory } from 'react-router-dom'

export interface IProps {
  hasUserVotedUseful: boolean
  votedUsefulCount: number | undefined
  isLoggedIn: boolean
  onUsefulClick: () => void
  sx?: ThemeUIStyleObject
  disabled?: boolean
}

export const UsefulStatsButton = (props: IProps) => {
  const theme: any = useTheme()
  const history = useHistory()

  const [votedUsefulCount, setVotedUsefulCount] = useState<number>()
  const [hasUserVotedUseful, setHasUserVotedUseful] = useState<boolean>()
  const [disabled, setDisabled] = useState<boolean>()

  useEffect(
    () => setHasUserVotedUseful(props.hasUserVotedUseful),
    [props.hasUserVotedUseful],
  )
  useEffect(
    () => setVotedUsefulCount(props.votedUsefulCount || 0),
    [props.votedUsefulCount],
  )
  useEffect(() => setDisabled(props.disabled), [props.disabled])

  const handleUsefulClick = () => {
    setDisabled(true)
    props.onUsefulClick()
    setDisabled(false)
  }

  return (
    <>
      <Button
        data-tip={props.isLoggedIn ? '' : 'Login to add your vote'}
        data-cy={props.isLoggedIn ? 'vote-useful' : 'vote-useful-redirect'}
        onClick={() =>
          props.isLoggedIn ? handleUsefulClick() : history.push('/sign-in')
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
        icon={hasUserVotedUseful ? 'star' : 'star-active'}
      >
        <Text
          pr={2}
          py={2}
          sx={{
            display: 'inline-block',
          }}
        >
          {votedUsefulCount}
        </Text>
        <Text
          pl={2}
          py={2}
          sx={{
            display: 'inline-block',
            borderLeft: `1px solid ${theme.colors.black}`,
          }}
        >
          {hasUserVotedUseful ? 'Marked as useful' : 'Mark as useful'}
        </Text>
      </Button>
      <Tooltip />
    </>
  )
}
