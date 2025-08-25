import { useMemo, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import { Flex, Text, useThemeUI } from 'theme-ui'

import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  usefulButtonLiteConfig: {
    hasUserVotedUseful: boolean
    votedUsefulCount: number
    isLoggedIn: boolean
    onUsefulClick: (
      vote: 'add' | 'delete',
      eventCategory?: string,
    ) => Promise<void>
    sx?: ThemeUIStyleObject
  }
}

export const UsefulButtonLite = (props: IProps) => {
  const {
    hasUserVotedUseful,
    votedUsefulCount,
    isLoggedIn,
    sx,
    onUsefulClick,
  } = props.usefulButtonLiteConfig

  const { theme } = useThemeUI() as any
  const navigate = useNavigate()
  const uuid = useMemo(() => (Math.random() * 16).toString(), [])
  const [disabled, setDisabled] = useState<boolean>()
  const usefulAction = hasUserVotedUseful ? 'delete' : 'add'
  const handleUsefulClick = async () => {
    setDisabled(true)
    try {
      await onUsefulClick(usefulAction, 'Comment')
    } catch (err) {
      // handle error or ignore
    }
    setDisabled(false)
  }

  const backgroundColor =
    !votedUsefulCount || votedUsefulCount === 0
      ? 'transparent'
      : hasUserVotedUseful
        ? theme.colors.offWhite
        : theme.colors.silver

  return (
    <Flex sx={{ alignSelf: 'flex-end' }}>
      <Button
        type="button"
        data-tooltip-id={uuid}
        data-tooltip-content={isLoggedIn ? '' : 'Login to add your vote'}
        data-cy={isLoggedIn ? 'vote-useful' : 'vote-useful-redirect'}
        onClick={() =>
          isLoggedIn
            ? handleUsefulClick()
            : navigate(
                '/sign-in?returnUrl=' + encodeURIComponent(location.pathname),
              )
        }
        disabled={disabled}
        sx={{
          fontSize: 1,
          backgroundColor: backgroundColor,
          border: 'none',
          marginRight: 5,
          padding: 1,
          paddingRight: 4,
          display: 'flex',
          height: '20px',
          minHeight: '20px',
          alignItems: 'center',
          width: 'auto',
          gap: 1,
          '&:hover': {
            backgroundColor: backgroundColor,
            transform: 'none',
            boxShadow: 'none',
          },
          ...sx,
        }}
      >
        <Flex sx={{ alignItems: 'center' }}>
          {votedUsefulCount > 0 && (
            <Text
              sx={{
                display: 'inline-block',
              }}
            >
              {votedUsefulCount ?? 0}
            </Text>
          )}
          <Icon
            glyph={'star-active'}
            ml={5}
            size={18}
            filter={hasUserVotedUseful ? 'unset' : 'grayscale(1)'}
            sx={{
              position: 'absolute',
              right: '-10px',
            }}
          />
        </Flex>
      </Button>
    </Flex>
  )
}
