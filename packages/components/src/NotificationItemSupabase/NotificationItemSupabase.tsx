import { Avatar, Flex, Text, useThemeUI } from 'theme-ui';

import defaultProfileImage from '../../assets/images/default_member.svg';
import { DisplayDate } from '../DisplayDate/DisplayDate';
import { Icon } from '../Icon/Icon';
import { InternalLink } from '../InternalLink/InternalLink';

import type { NotificationDisplay } from 'oa-shared';
import type { ThemeUIStyleObject } from 'theme-ui';
import type { availableGlyphs } from '../Icon/types';

interface IProps {
  markRead: (id: number) => void;
  modalDismiss: () => void;
  notification: NotificationDisplay;
}

/**
 * Converts a hex color to rgba with specified opacity
 */
const hexToRgba = (hex: string, opacity: number): string => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

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
  const { theme } = useThemeUI() as any;
  const { markRead, modalDismiss, notification } = props;

  // Calculate 40% opacity background color for unread notifications
  const primaryColorWithOpacity = hexToRgba(theme.colors.primary as string, 0.4);

  const borderStyle = {
    background: notification.isRead ? 'background' : primaryColorWithOpacity,
    borderColor: notification.isRead ? 'background' : theme.colors.primary,
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

  const isDiscussion =
    notification.contentType === 'comment' || notification.contentType === 'reply';

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
            <Flex sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
              <Flex sx={{ gap: 2, alignItems: 'center', flex: 1 }}>
                {notification.triggeredByAvatar && (
                  <Avatar
                    src={notification.triggeredByAvatar.publicUrl}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                    alt={`Avatar of ${notification.triggeredBy}`}
                    loading="lazy"
                  />
                )}
                {!notification.triggeredByAvatar && (
                  <Avatar
                    src={defaultProfileImage}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                    alt={`Avatar of ${notification.triggeredBy}`}
                    loading="lazy"
                  />
                )}
                <Text sx={{ flex: 1 }}>
                  {notification.triggeredBy} {notification.title}
                </Text>
              </Flex>
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
