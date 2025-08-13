import { useMemo, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import { Flex, Text, useThemeUI } from 'theme-ui'

import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  hasUserVotedUseful?: boolean
  votedUsefulCount: number | undefined
  isLoggedIn: boolean
  onUsefulClick: (
    vote: 'add' | 'delete',
    eventCategory?: string,
  ) => Promise<void>
  sx?: ThemeUIStyleObject
}

export const UsefulButtonLite = (props: IProps) => {
  const { hasUserVotedUseful, votedUsefulCount } = props
  const { theme } = useThemeUI() as any
  const navigate = useNavigate()
  const uuid = useMemo(() => (Math.random() * 16).toString(), [])
  const [disabled, setDisabled] = useState<boolean>()
  const usefulAction = hasUserVotedUseful ? 'delete' : 'add'
  const handleUsefulClick = async () => {
    setDisabled(true)
    try {
      await props.onUsefulClick(usefulAction, 'Comment')
    } catch (err) {
      // handle error or ignore
    }
    setDisabled(false)
  }

  return (
    <Flex sx={{ alignSelf: 'flex-end' }}>
      <Button
        type="button"
        data-tooltip-id={uuid}
        data-tooltip-content={props.isLoggedIn ? '' : 'Login to add your vote'}
        data-cy={props.isLoggedIn ? 'vote-useful' : 'vote-useful-redirect'}
        onClick={() =>
          props.isLoggedIn
            ? handleUsefulClick()
            : navigate(
                '/sign-in?returnUrl=' + encodeURIComponent(location.pathname),
              )
        }
        disabled={disabled}
        sx={{
          fontSize: 1,
          backgroundColor: hasUserVotedUseful
            ? theme.colors.offWhite
            : theme.colors.softgrey,
          border: 'none',
          margin: 0,
          padding: 1,
          display: 'flex',
          height: '80%',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            backgroundColor: theme.colors.softblue,
          },
          ...props.sx,
        }}
      >
        <Flex sx={{ alignItems: 'center' }}>
          <Text
            sx={{
              display: 'inline-block',
            }}
          >
            {votedUsefulCount ?? 0}
          </Text>
          <Icon
            glyph={'star-active'}
            ml={3}
            size={'sm'}
            filter={hasUserVotedUseful ? 'unset' : 'grayscale(1)'}
          />
        </Flex>
      </Button>
    </Flex>
  )
}
