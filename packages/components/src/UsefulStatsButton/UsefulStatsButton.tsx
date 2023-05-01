import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import type { ThemeUIStyleObject } from 'theme-ui'
import { Flex, Text } from 'theme-ui'
import { Button, ExternalLink, Icon } from '../'

const StyledTooltip = styled(ReactTooltip)`
  opacity: 1 !important;
  z-index: 9999 !important;
`

type TooltipProps = {
  children?: React.ReactNode
}

const Tooltip = ({ children, ...props }: TooltipProps) => {
  return (
    <StyledTooltip
      event="mouseenter focus"
      eventOff="mouseleave blur"
      effect="solid"
      {...props}
    >
      {children}
    </StyledTooltip>
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
    <Button
      data-cy="vote-useful"
      onClick={handleUsefulClick}
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
        {votedUsefulCount ? votedUsefulCount : 0}
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
  ) : (
    <>
      <ExternalLink
        href="/sign-in"
        data-cy="vote-useful-redirect"
        data-tip={'Login to add your vote'}
        sx={{
          ...theme.buttons.subtle,
          borderColor: theme.colors.black,
          backgroundColor: theme.colors.white,
          display: 'inline-flex',
          fontSize: 2,
          gap: 2,
          px: 2,
          py: 0,
          '&:hover': {
            backgroundColor: theme.colors.softblue,
            borderColor: theme.colors.black,
          },
          ...props.sx,
        }}
      >
        <Icon glyph={hasUserVotedUseful ? 'star' : 'star-active'} />
        <Flex>
          <Text
            pr={2}
            py={2}
            sx={{
              display: 'inline-block',
            }}
          >
            {votedUsefulCount ? votedUsefulCount : 0}
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
        </Flex>
      </ExternalLink>
      <Tooltip />
    </>
  )
}
