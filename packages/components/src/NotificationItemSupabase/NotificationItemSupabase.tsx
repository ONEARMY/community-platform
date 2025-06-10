import { Flex, Text } from 'theme-ui'

import { DisplayDate } from '../DisplayDate/DisplayDate'
import { Icon } from '../Icon/Icon'
import { InternalLink } from '../InternalLink/InternalLink'

import type { NotificationDisplay } from 'oa-shared'
import type { availableGlyphs } from '../Icon/types'

interface IProps {
  markRead: (id: number) => void
  modalDismiss: () => void
  notification: NotificationDisplay
}

export const NotificationItemSupabase = (props: IProps) => {
  const { markRead, modalDismiss, notification } = props

  const borderStyle = {
    background: notification.isRead ? 'background' : '#fff0b4',
    borderColor: notification.isRead ? 'background' : 'activeYellow',
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 2,
    gap: 2,
  }

  const onClick = () => {
    markRead(notification.id)
    modalDismiss()
  }

  return (
    <Flex
      data-cy="NotificationListItemSupabase"
      data-testid="NotificationListItemSupabase"
      sx={{ gap: 2 }}
    >
      <Flex
        sx={{
          ...borderStyle,
          alignItems: 'center',
          cursor: 'pointer',
          display: notification.isRead ? 'none' : 'flex',
          '&:hover': {
            background: '#fee77b',
          },
        }}
        onClick={() => markRead(notification.id)}
      >
        <Icon
          data-cy="NotificationListItemSupabase-unread"
          glyph="chevron-right"
        />
      </Flex>
      <Flex sx={{ ...borderStyle, flex: 1 }}>
        {notification.sidebar.icon && (
          <Flex>
            <Icon
              glyph={notification.sidebar.icon as availableGlyphs}
              size={30}
            />
          </Flex>
        )}

        <Flex sx={{ flex: 1, flexDirection: 'column', gap: 2 }}>
          <Flex sx={{ justifyContent: 'space-between', gap: 2 }}>
            <Text>
              <InternalLink
                to={`/u/${notification.title.triggeredBy}`}
                sx={{
                  color: 'grey',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={onClick}
              >
                {notification.title.triggeredBy}
              </InternalLink>{' '}
              {notification.title.middle}
              {' on '}{' '}
              <InternalLink
                to={notification.title.parentSlug}
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={onClick}
              >
                {notification.title.parentTitle}
              </InternalLink>
            </Text>
            <Text sx={{ fontSize: 1, color: 'grey', textAlign: 'right' }}>
              <DisplayDate createdAt={notification.date} showLabel={false} />
            </Text>
          </Flex>
          <InternalLink
            to={notification.slug}
            sx={{ color: 'black' }}
            onClick={onClick}
          >
            <Flex
              sx={{
                background: '#E2EDF7',
                border: '2px solid black',
                borderRadius: 5,
                padding: 2,
              }}
            >
              <Text sx={{ alignSelf: 'flex-start' }}>{notification.body}</Text>
            </Flex>
          </InternalLink>
        </Flex>
      </Flex>
    </Flex>
  )
}
