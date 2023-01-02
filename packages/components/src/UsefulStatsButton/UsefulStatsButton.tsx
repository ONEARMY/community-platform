import { useEffect, useState } from 'react'
import { Text } from 'theme-ui'
import { Button, Icon, ExternalLink } from '../'
import ReactTooltip from 'react-tooltip'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'

const StyledTooltip = styled(ReactTooltip)`
  opacity: 1 !important;
  z-index: 9999 !important;
`

const Tooltip: React.FC = (props) => {
  return (
    <StyledTooltip
      event="mouseenter focus"
      eventOff="mouseleave blur"
      effect="solid"
      {...props}
    />
  )
}

export interface IProps {
  hasUserVotedUseful: boolean
  votedUsefulCount: number
  isLoggedIn: boolean
  onUsefulClick: () => void
}

export const UsefulStatsButton = (props: IProps) => {
  const theme: any = useTheme()

  const [votedUsefulCount, setVotedUsefulCount] = useState<number>()
  const [hasUserVotedUseful, setHasUserVotedUseful] = useState<boolean>()

  useEffect(
    () => setHasUserVotedUseful(props.hasUserVotedUseful),
    [props.hasUserVotedUseful],
  )
  useEffect(
    () => setVotedUsefulCount(props.votedUsefulCount),
    [props.votedUsefulCount],
  )
  const handleUsefulClick = () => {
    props.onUsefulClick()
  }

  return props.isLoggedIn ? (
    <>
      <Button
        data-cy="vote-useful"
        variant="subtle"
        onClick={handleUsefulClick}
        sx={{
          fontSize: 2,
          ml: 1,
          background: 'softyellow',
          borderColor: 'softyellow',
        }}
        icon={hasUserVotedUseful ? 'star-active' : 'star'}
      >
        <Text ml={1}>Useful {votedUsefulCount ? votedUsefulCount : ''}</Text>
      </Button>
    </>
  ) : (
    <>
      <ExternalLink
        href="/sign-in"
        data-cy="vote-useful-redirect"
        data-tip={'Login to add your vote'}
        sx={{
          ...theme.buttons.subtle,
          borderColor: 'softyellow',
          background: 'softyellow',
          display: 'inline-flex',
          fontSize: 2,
          paddingY: 2,
          paddingX: 3,
          ml: 2,
        }}
      >
        <Icon glyph={hasUserVotedUseful ? 'star-active' : 'star'} />
        <Text ml={2}>Useful {votedUsefulCount ? votedUsefulCount : ''}</Text>
      </ExternalLink>
      <Tooltip />
    </>
  )
}
