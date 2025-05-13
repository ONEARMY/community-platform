import { Flex, Text } from 'theme-ui'

import { DisplayDate } from '../DisplayDate/DisplayDate'
import { Icon } from '../Icon/Icon'
import { InternalLink } from '../InternalLink/InternalLink'

import type { Comment, News, Notification } from 'oa-shared'

interface IProps {
  markRead: (id: number) => void
  modalDismiss: () => void
  notification: Notification
}

export const NotificationListItemSupabase = (props: IProps) => {
  const { markRead, modalDismiss, notification } = props

  const sourceContentLink = `/${notification.sourceContentType}/${
    (notification.sourceContent as News).slug
  }`
  const notificationIcon =
    notification.contentType !== 'news' ? 'discussion' : 'thunderbolt'

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
        {notification.contentType !== 'news' && (
          <Flex>
            <Icon glyph={notificationIcon} size={30} />
          </Flex>
        )}

        <Flex sx={{ flex: 1, flexDirection: 'column', gap: 2 }}>
          <Flex sx={{ justifyContent: 'space-between', gap: 2 }}>
            <Text>
              <InternalLink
                to={`/u/${notification.triggeredBy?.username}`}
                sx={{
                  color: 'grey',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={onClick}
              >
                {notification.triggeredBy?.username}
              </InternalLink>{' '}
              has left a new {notification.contentType}
              {(notification.sourceContent as News).title && (
                <>
                  {' on '}{' '}
                  <InternalLink
                    to={sourceContentLink}
                    sx={{
                      color: 'black',
                      fontWeight: 'bold',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                    onClick={onClick}
                  >
                    {(notification.sourceContent as News).title}
                  </InternalLink>
                </>
              )}
            </Text>
            <Text sx={{ fontSize: 1, color: 'grey', textAlign: 'right' }}>
              <DisplayDate
                createdAt={notification.createdAt}
                modifiedAt={notification.modifiedAt}
                showLabel={false}
              />
            </Text>
          </Flex>
          <InternalLink
            to={`${sourceContentLink}#comment:${notification.content?.id}`}
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
              {(notification.content as unknown as Comment)?.comment && (
                <Text sx={{ alignSelf: 'flex-start' }}>
                  {(notification.content as unknown as Comment)?.comment}
                </Text>
              )}
            </Flex>
          </InternalLink>
        </Flex>
      </Flex>
    </Flex>
  )
}
