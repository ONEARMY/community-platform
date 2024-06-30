import { ThemeProvider } from '@emotion/react'
import { Box, Flex } from 'theme-ui'

import { Icon } from '../Icon/Icon'

import type {
  NotificationType,
  UserNotificationItem,
} from '@onearmy.apps/shared'
import type { availableGlyphs } from '../Icon/types'

function getIconByType(type: NotificationType): availableGlyphs {
  if (['howto_useful', 'research_useful'].includes(type)) return 'useful'
  if (
    ['howto_approved', 'map_pin_approved', 'research_approved'].includes(type)
  )
    return 'check'
  if (
    [
      'howto_needs_updates',
      'map_pin_needs_updates',
      'research_needs_updates',
    ].includes(type)
  )
    return 'edit'

  if (type === 'research_update') return 'thunderbolt'

  return 'comment'
}

export const NotificationItem = (props: UserNotificationItem) => {
  const { type } = props
  return (
    <Flex
      bg="white"
      data-cy="notification"
      sx={{
        flexDirection: 'column',
        fontSize: '12px',
        marginBottom: 2,
        paddingBottom: 2,
        borderBottom: '1px solid #c7c7c7',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <ThemeProvider
        theme={{
          styles: {
            a: {
              textDecoration: 'underline',
              color: '#61646b',
              display: 'inline',
              '&:hover': {
                textDecoration: 'none',
              },
            },
          },
        }}
      >
        <Flex sx={{ gap: 1, flexDirection: 'row' }}>
          <Icon glyph={getIconByType(type)} size={15} />
          <Box sx={{ textAlign: 'left' }}>{props.children}</Box>
        </Flex>
      </ThemeProvider>
    </Flex>
  )
}
