import type { NotificationDisplay } from 'oa-shared';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DisplayDate } from '@/components/ui/display-date';
import CommentIcon from '@/components/ui/icons/comment.svg?react';
import ThunderboltIcon from '@/components/ui/icons/thunderbolt.svg?react';
import UpdateIcon from '@/components/ui/icons/update.svg?react';
import { cn } from '@/lib/utils';
import './notification-item.css';

interface IProps {
  markRead: (id: number) => void;
  modalDismiss: () => void;
  notification: NotificationDisplay;
}

const SIDEBAR_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  comment: CommentIcon,
  update: UpdateIcon,
  thunderbolt: ThunderboltIcon,
};

export const NotificationItem = ({ markRead, modalDismiss, notification }: IProps) => {
  const onClick = () => {
    markRead(notification.id);
    modalDismiss();
  };

  const isDiscussion = notification.contentType === 'comments';
  const isNews = notification.contentType === 'news';
  const SidebarIcon = notification.sidebar.icon ? SIDEBAR_ICONS[notification.sidebar.icon] : null;

  return (
    <Link
      data-cy="NotificationListItemSupabase"
      data-testid="NotificationListItemSupabase"
      to={notification.link}
      onClick={onClick}
      className={cn(
        'flex gap-2.5 rounded-xl border-2 p-2.5 text-foreground no-underline transition-colors',
        notification.isRead
          ? 'border-muted bg-muted hover:border-border'
          : 'border-accent bg-accent/25 hover:bg-accent/40',
      )}
    >
      {notification.sidebar.image ? (
        <Avatar className={cn('size-14 shrink-0', isNews && 'rounded-md')}>
          <AvatarImage src={notification.sidebar.image} alt="" />
          <AvatarFallback className={cn(isNews && 'rounded-md')}>
            {notification.triggeredBy.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        SidebarIcon && <SidebarIcon className="size-7 shrink-0" aria-hidden />
      )}

      <div className="flex min-w-0 flex-1 gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <p className="m-0">
            {notification.triggeredBy} <strong>{notification.title}</strong>
          </p>
          {notification.body && (
            <div className={cn('flex', isDiscussion && 'notification-quote')}>
              <p className="m-0 max-w-full truncate rounded-[25px] border-2 border-[#1b1b1b] bg-[#e2edf7] p-2">
                {notification.body}
              </p>
            </div>
          )}
        </div>
        <DisplayDate
          createdAt={notification.date}
          showLabel={false}
          className="shrink-0 self-start text-xs text-muted-foreground"
        />
      </div>
    </Link>
  );
};
