import { Icon, NotificationListSupabase, NotificationsModal } from 'oa-components';
import { useContext, useState } from 'react';
import { NotificationsContext } from 'src/pages/common/NotificationsContext';
import { Box } from 'theme-ui';

interface IProps {
  device: 'desktop' | 'mobile';
}

export const NotificationsSupabase = ({ device }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { notifications, isUpdatingNotifications, updateNotifications } =
    useContext(NotificationsContext);

  if (!notifications === undefined) {
    return <></>;
  }

  const markAllRead = async () => {
    await fetch(`/api/notifications/all/read`, { method: 'POST' });
    updateNotifications && (await updateNotifications());
  };

  const markRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    updateNotifications && (await updateNotifications());
  };

  const hasNewNotifications =
    notifications && notifications?.filter(({ isRead }) => isRead === false).length > 0;

  const onClick = () => setIsOpen(!isOpen);

  const iconProps = {
    onClick,
    size: 40,
    sx: {
      ':hover': {
        background: 'background',
        borderRadius: 99,
      },
    },
  };

  return (
    <Box data-cy={`NotificationsSupabase-${device}`}>
      {!hasNewNotifications && (
        <Icon data-cy="notifications-no-new-messages" glyph="megaphone-inactive" {...iconProps} />
      )}
      {hasNewNotifications && (
        <Icon data-cy="notifications-new-messages" glyph="megaphone-active" {...iconProps} />
      )}
      <NotificationsModal isOpen={isOpen}>
        <NotificationListSupabase
          isUpdatingNotifications={isUpdatingNotifications}
          markAllRead={markAllRead}
          markRead={markRead}
          modalDismiss={onClick}
          notifications={notifications || []}
        />
      </NotificationsModal>
    </Box>
  );
};
