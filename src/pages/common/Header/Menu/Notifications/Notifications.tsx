import type { NotificationDisplay } from 'oa-shared';
import { useContext, useMemo, useState } from 'react';
import { NotificationsContext } from 'src/pages/common/NotificationsContext';
import NotificationsIcon from '@/components/ui/icons/notifications.svg?react';
import NotificationsActiveIcon from '@/components/ui/icons/notifications-active.svg?react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NotificationList } from './NotificationList';

interface IProps {
  device: 'desktop' | 'mobile';
}

const NO_NOTIFICATIONS: NotificationDisplay[] = [];

export const NotificationsSupabase = ({ device }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { notifications, isUpdatingNotifications, updateNotifications } =
    useContext(NotificationsContext);

  const markAllRead = async () => {
    await fetch(`/api/notifications/all/read`, { method: 'POST' });
    await updateNotifications();
  };

  const markRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    await updateNotifications();
  };

  const hasNewNotifications = useMemo(
    () => !!notifications?.some(({ isRead }) => !isRead),
    [notifications],
  );
  const BellIcon = hasNewNotifications ? NotificationsActiveIcon : NotificationsIcon;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        data-cy={`NotificationsSupabase-${device}`}
        aria-label="Notifications"
        className="cursor-pointer rounded-full border-none bg-transparent p-1 text-foreground hover:bg-muted"
      >
        <BellIcon
          data-cy={
            hasNewNotifications ? 'notifications-new-messages' : 'notifications-no-new-messages'
          }
          className="size-6"
        />
      </SheetTrigger>
      <SheetContent
        side="top"
        showCloseButton={false}
        className="z-[var(--z-above-header)] mx-auto max-h-dvh max-w-160 overflow-y-auto px-3 py-5 md:px-5"
        overlayClassName="z-[var(--z-above-header)]"
      >
        <SheetTitle className="sr-only">Notifications</SheetTitle>
        <NotificationList
          isUpdatingNotifications={isUpdatingNotifications}
          markAllRead={markAllRead}
          markRead={markRead}
          modalDismiss={() => setIsOpen(false)}
          notifications={notifications || NO_NOTIFICATIONS}
        />
      </SheetContent>
    </Sheet>
  );
};
