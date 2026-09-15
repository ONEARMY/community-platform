import { CheckCheckIcon } from 'lucide-react';
import type { NotificationDisplay } from 'oa-shared';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import AccountIcon from '@/components/ui/icons/account.svg?react';
import CloseIcon from '@/components/ui/icons/close.svg?react';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NotificationItem } from './NotificationItem';

export interface IProps {
  isUpdatingNotifications: boolean;
  markAllRead: () => void;
  markRead: (id: number) => void;
  modalDismiss: () => void;
  notifications: NotificationDisplay[];
}

type Filter = 'unread' | 'all';

export const NotificationList = (props: IProps) => {
  const { isUpdatingNotifications, markAllRead, markRead, modalDismiss, notifications } = props;
  const [filter, setFilter] = useState<Filter>('unread');

  const anyUnread = notifications.some(({ isRead }) => !isRead);
  const notificationList = notifications
    .filter(({ isRead }) => (filter === 'unread' ? !isRead : true))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  // Only block on the very first load - later refetches keep the list in place.
  const isInitialLoad = isUpdatingNotifications && notifications.length === 0;

  return (
    <div data-cy="NotificationListSupabase" className="flex flex-col gap-5 pb-3">
      <div className="flex items-center justify-between">
        <h2 className="m-0 font-heading text-2xl">Notifications</h2>
        <Button
          data-cy="NotificationListSupabase-CloseButton"
          variant="ghost"
          size="icon"
          onClick={modalDismiss}
          aria-label="Close notifications"
          className="rounded-full hover:bg-[var(--color-primary-hover)]"
        >
          <CloseIcon />
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <ToggleGroup
            value={[filter]}
            onValueChange={([next]) => next && setFilter(next as Filter)}
          >
            <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
            <ToggleGroupItem data-testid="NotificationListSupabase-ShowAll" value="all">
              All
            </ToggleGroupItem>
          </ToggleGroup>
          {anyUnread && (
            <Button
              data-testid="NotificationListSupabase-MarkAllRead"
              data-cy="NotificationListSupabase-MarkAllRead"
              variant="outline"
              onClick={markAllRead}
              disabled={isUpdatingNotifications}
            >
              <CheckCheckIcon />
              Mark all read
            </Button>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                onClick={modalDismiss}
                nativeButton={false}
                aria-label="Update preferences"
                render={<Link to="/settings/notifications" />}
              />
            }
          >
            <AccountIcon />
          </TooltipTrigger>
          <TooltipContent>Update preferences</TooltipContent>
        </Tooltip>
      </div>

      {isInitialLoad && (
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      )}

      {!isInitialLoad && (
        <div className="flex flex-col gap-2.5">
          {notificationList.map((notification) => (
            <NotificationItem
              key={notification.id}
              markRead={markRead}
              modalDismiss={modalDismiss}
              notification={notification}
            />
          ))}
        </div>
      )}

      {!isInitialLoad && notificationList.length === 0 && (
        <div className="rounded-xl bg-muted p-5 text-center">
          {filter === 'unread' ? 'Wow... No unread notifications!' : 'No notifications yet.'}
        </div>
      )}
    </div>
  );
};
