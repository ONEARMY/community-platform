import { ThemeProvider } from '@emotion/react'
import { Flex, Box } from 'theme-ui'
import { Icon } from '../Icon/Icon'
import type { availableGlyphs } from '../Icon/types'

type notificationType =
  | 'howto_mention'
  | 'new_comment'
  | 'howto_useful'
  | 'new_comment_research'
  | 'research_useful'
  | 'research_mention'
  | 'research_update'

export interface UserNotificationItem {
  type: notificationType
  children: React.ReactNode
}

function getIconByType(type: notificationType): availableGlyphs {
  if (['howto_useful', 'research_useful'].includes(type)) return 'useful'

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
            <Icon glyph={getIconByType(type)} size={15} mr={2} />
          </Box>
          {props.children}
        </Flex>
      </ThemeProvider>
    </Flex>
  )
}
