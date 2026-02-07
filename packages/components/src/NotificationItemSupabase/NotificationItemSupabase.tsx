import type { NotificationDisplay } from 'oa-shared';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Flex, Text } from 'theme-ui';
import { DisplayDate } from '../DisplayDate/DisplayDate';
import { Icon } from '../Icon/Icon';
import type { availableGlyphs } from '../Icon/types';
import { InternalLink } from '../InternalLink/InternalLink';

interface IProps {
  markRead: (id: number) => void;
  modalDismiss: () => void;
  notification: NotificationDisplay;
}

const commentStyling = {
  '::before': {
    content: 'open-quote',
    position: 'absolute',
    fontSize: '4em',
    color: 'white',
    textShadow:
      '2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000',
    transform: 'translateX(-8px) rotate(-10deg) translateY(-12px)',
  },
  '::after': {
    content: 'close-quote',
    position: 'relative',
    bottom: 0,
    height: 0,
    width: '10px',
    fontSize: '4em',
    color: 'white',
    textShadow:
      '2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000',
    transform: 'translateX(-8px) rotate(10deg) translateY(14px)',
  },
} as ThemeUIStyleObject;

export const NotificationItemSupabase = (props: IProps) => {
  const { markRead, modalDismiss, notification } = props;

  const borderStyle = {
    background: notification.isRead ? 'background' : '#fff0b4',
    borderColor: notification.isRead ? 'background' : 'activeYellow',
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 2,
    gap: 2,
  };

  const onClick = () => {
    markRead(notification.id);
    modalDismiss();
  };

  const isDiscussion = notification.contentType === 'comments';

  return (
    <Flex data-cy="NotificationListItemSupabase" data-testid="NotificationListItemSupabase">
      <InternalLink onClick={onClick} to={notification.link} sx={{ color: 'black', width: '100%' }}>
        <Flex sx={borderStyle}>
          {notification.sidebar.image && <>hi</>}
          {notification.sidebar.icon && (
            <Flex>
              <Icon glyph={notification.sidebar.icon as availableGlyphs} size={30} />
            </Flex>
          )}
          <Flex sx={{ flex: 1, flexDirection: 'column', gap: 2 }}>
            <Flex sx={{ justifyContent: 'space-between', gap: 2 }}>
              <Text sx={{ flex: 1 }}>
                {notification.triggeredBy} {notification.title}
              </Text>
              <Text sx={{ fontSize: 1, color: 'grey', textAlign: 'right' }}>
                <DisplayDate createdAt={notification.date} showLabel={false} />
              </Text>
            </Flex>
            <Flex sx={{ ...(isDiscussion ? commentStyling : {}) }}>
              <Text
                sx={{
                  background: 'softblue',
                  border: '2px solid black',
                  borderRadius: 5,
                  padding: 2,

                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {notification.body}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </InternalLink>
    </Flex>
  );
};
