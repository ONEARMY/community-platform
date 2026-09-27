import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { factoryNotificationDisplay } from 'src/test/factories/notificationDisplay';
import { describe, expect, it, vi } from 'vitest';
import { NotificationList } from './NotificationList';

const renderList = (props: Partial<Parameters<typeof NotificationList>[0]> = {}) =>
  render(
    <MemoryRouter>
      <NotificationList
        isUpdatingNotifications={false}
        markAllRead={vi.fn()}
        markRead={vi.fn()}
        modalDismiss={vi.fn()}
        notifications={[]}
        {...props}
      />
    </MemoryRouter>,
  );

describe('NotificationList', () => {
  it('shows only unread notifications by default', () => {
    renderList({
      notifications: [
        factoryNotificationDisplay({ isRead: false }),
        factoryNotificationDisplay({ isRead: true }),
      ],
    });

    expect(screen.getAllByTestId('NotificationListItemSupabase')).toHaveLength(1);
  });

  it('shows read notifications too once "All" is selected', async () => {
    renderList({
      notifications: [
        factoryNotificationDisplay({ isRead: false }),
        factoryNotificationDisplay({ isRead: true }),
      ],
    });

    await userEvent.click(screen.getByTestId('NotificationListSupabase-ShowAll'));

    expect(screen.getAllByTestId('NotificationListItemSupabase')).toHaveLength(2);
  });

  it('offers "Mark all read" only while something is unread', () => {
    const { rerender } = renderList({
      notifications: [factoryNotificationDisplay({ isRead: false })],
    });
    expect(screen.getByTestId('NotificationListSupabase-MarkAllRead')).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <NotificationList
          isUpdatingNotifications={false}
          markAllRead={vi.fn()}
          markRead={vi.fn()}
          modalDismiss={vi.fn()}
          notifications={[factoryNotificationDisplay({ isRead: true })]}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('NotificationListSupabase-MarkAllRead')).not.toBeInTheDocument();
  });

  it('keeps the list rendered while a refetch is in flight', () => {
    renderList({
      isUpdatingNotifications: true,
      notifications: [factoryNotificationDisplay({ isRead: false })],
    });

    expect(screen.getAllByTestId('NotificationListItemSupabase')).toHaveLength(1);
    expect(screen.getByTestId('NotificationListSupabase-MarkAllRead')).toBeDisabled();
  });

  it('marks a notification read and dismisses the panel when opened', async () => {
    const markRead = vi.fn();
    const modalDismiss = vi.fn();
    const notification = factoryNotificationDisplay({ isRead: false });
    renderList({ markRead, modalDismiss, notifications: [notification] });

    await userEvent.click(screen.getByTestId('NotificationListItemSupabase'));

    expect(markRead).toHaveBeenCalledWith(notification.id);
    expect(modalDismiss).toHaveBeenCalled();
  });
});

describe('NotificationItem sidebar', () => {
  it('falls back to the content-type icon when there is no image', () => {
    renderList({
      notifications: [
        factoryNotificationDisplay({
          isRead: false,
          sidebar: { icon: 'thunderbolt', image: undefined },
        }),
      ],
    });

    const item = screen.getByTestId('NotificationListItemSupabase');
    expect(item.querySelector('svg')).toBeInTheDocument();
    expect(item.querySelector('img')).not.toBeInTheDocument();
  });
});
