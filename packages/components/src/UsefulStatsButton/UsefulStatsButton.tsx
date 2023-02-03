import { useEffect, useState } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'
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
  sx?: ThemeUIStyleObject
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
          background: 'softyellow',
          borderColor: 'softyellow',
          paddingBottom: 0,
          paddingTop: 0,
          ...props.sx,
        }}
        icon={hasUserVotedUseful ? 'star' : 'star-active'}
      >
        <Text
          pr={2}
          py={2}
          sx={{
            display: 'inline-block',
            borderRight: `1px solid ${theme.colors.lightgrey}`,
          }}
        >
          {votedUsefulCount ? votedUsefulCount : ''}
        </Text>
        <Text
          pl={2}
          py={2}
          sx={{
            display: 'inline-block',
          }}
        >
          {hasUserVotedUseful ? 'Marked as useful' : 'Mark as useful'}
        </Text>
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
          ...props.sx,
        }}
      >
        <Icon glyph={hasUserVotedUseful ? 'star-active' : 'star'} />
        <Text ml={2}>Useful {votedUsefulCount ? votedUsefulCount : ''}</Text>
      </ExternalLink>
      <Tooltip />
    </>
  )
}
