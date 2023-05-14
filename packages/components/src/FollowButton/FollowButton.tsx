import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import type { ThemeUIStyleObject } from 'theme-ui'
import { Flex, Text } from 'theme-ui'
import { Button, ExternalLink, Icon } from '..'

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
  hasUserSubscribed: boolean
  isLoggedIn: boolean
  onFollowClick: () => void
  sx?: ThemeUIStyleObject
}

export const FollowButton = (props: IProps) => {
  const theme: any = useTheme()

  const [hasUserSubscribed, setHasUserSubscribed] = useState<boolean>()

  useEffect(
    () => setHasUserSubscribed(props.hasUserSubscribed),
    [props.hasUserSubscribed],
  )
  const handleFollowClick = () => {
    props.onFollowClick()
  }

  return props.isLoggedIn ? (
    <Button
      data-testid="follow-button"
      data-cy="follow-button"
      icon="thunderbolt"
      variant="outline"
      iconColor={hasUserSubscribed ? 'subscribed' : 'notSubscribed'}
      sx={{
        fontSize: 2,
        py: 0,
      }}
      onClick={handleFollowClick}
    >
      {hasUserSubscribed ? 'Following' : 'Follow'}
    </Button>
  ) : (
    <>
      <ExternalLink
        href="/sign-in"
        data-cy="follow-redirect"
        data-testid="follow-redirect"
        data-tip={'Login to follow'}
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
        <Icon glyph="thunderbolt" color="notSubscribed" />
        <Flex>
          <Text
            pl={2}
            py={2}
            sx={{
              display: 'inline-block',
              borderLeft: `1px solid ${theme.colors.black}`,
            }}
          >
            {hasUserSubscribed ? 'Following' : 'Follow'}
          </Text>
        </Flex>
      </ExternalLink>
      <Tooltip />
    </>
  )
}
