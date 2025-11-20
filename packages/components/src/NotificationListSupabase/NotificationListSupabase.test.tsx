import '@testing-library/jest-dom/vitest';

import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { fakeDisplayNotification } from '../utils';
import { NotificationListSupabase } from './NotificationListSupabase';

describe('NotificationListSupabase', () => {
  it('Can show all notifications', () => {
    const newsReplyNotification = fakeDisplayNotification({ isRead: false });
    const questionCommentNotification = fakeDisplayNotification({
      isRead: true,
    });

    const { getAllByTestId } = render(
      <NotificationListSupabase
        isUpdatingNotifications={false}
        markAllRead={vi.fn()}
        markRead={vi.fn()}
        modalDismiss={vi.fn()}
        notifications={[newsReplyNotification, questionCommentNotification]}
      />,
    );

    const unreadNotifications = getAllByTestId('NotificationListItemSupabase');
    expect(unreadNotifications).toHaveLength(1);
  });
});
