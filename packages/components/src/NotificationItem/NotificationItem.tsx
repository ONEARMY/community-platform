import { ThemeProvider } from '@emotion/react'
import { Flex, Box } from 'theme-ui'
import { Icon } from '../Icon/Icon'
import type { availableGlyphs } from '../Icon/types'
import type { NotificationType } from 'oa-shared'
export interface UserNotificationItem {
  type: NotificationType
  children: React.ReactNode
}

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
      bg={'white'}
      data-cy="notification"
      sx={{
        flexDirection: 'column',
        width: '100%',
        fontSize: '12px',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #c7c7c7',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <ThemeProvider
        theme={{
          styles: {
            a: {
              textDecoration: 'underline',
              padding: '0 .25em',
              color: '#61646b',
              display: 'inline',
            },
          },
        }}
      >
        <Flex style={{ textAlign: 'left', color: 'black' }}>
          <Box sx={{ opacity: 0.6 }}>
            <Icon glyph={getIconByType(type)} size={15} mr={3} />
          </Box>
          {props.children}
        </Flex>
      </ThemeProvider>
    </Flex>
  )
}
