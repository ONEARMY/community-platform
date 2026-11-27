import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import type { NotificationStats } from 'oa-shared';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { AdminNotification } from './NotificationsPage';
import { NotificationsPage } from './NotificationsPage';

const stats: NotificationStats = {
  total: 4,
  weekly: [
    { week_start: '2026-11-09', total: 3 },
    { week_start: '2026-11-16', total: 1 },
  ],
  read: [
    { is_read: false, total: 3 },
    { is_read: true, total: 1 },
  ],
  types: [
    { action_type: 'newComment', content_type: 'comments', total: 3 },
    { action_type: 'newNews', content_type: 'news', total: 1 },
  ],
  preferences: {
    total: 2,
    comments: { enabled: 1, disabled: 1 },
    replies: { enabled: 2, disabled: 0 },
    research_updates: { enabled: 2, disabled: 0 },
    content_reach: { all: 1, important: 1, unset: 0 },
  },
  unsubscribed: 7,
};

const notification: AdminNotification = {
  id: 1,
  title: 'Shredder guide',
  actionType: 'newComment',
  contentType: 'comments',
  isRead: false,
  createdAt: '2026-11-20T10:30:00Z',
  recipient: { username: 'maker', displayName: 'Maker One' },
};

const renderPage = (overrides: Partial<Parameters<typeof NotificationsPage>[0]> = {}) =>
  render(
    <MemoryRouter>
      <NotificationsPage
        stats={stats}
        notifications={[notification]}
        page={1}
        totalPages={1}
        {...overrides}
      />
    </MemoryRouter>,
  );

describe('NotificationsPage', () => {
  it('shows the total, unsubscribed count and each panel', () => {
    renderPage();

    expect(screen.getByText('Total: 4')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    for (const title of [
      'Notifications per week',
      'Read and unread',
      'Notification type',
      'Notification preferences',
      'Unsubscribed',
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('lists read and unread with counts and percentages that add up', () => {
    renderPage();

    expect(screen.getAllByText('1 (25%)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3 (75%)').length).toBeGreaterThan(0);
  });

  it('groups types by action and content', () => {
    renderPage();

    expect(screen.getByText('New comment · Comments')).toBeInTheDocument();
    expect(screen.getByText('New news · News')).toBeInTheDocument();
  });

  it('lists each notification with recipient, status and date', () => {
    renderPage();

    expect(screen.getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');
    expect(screen.getByText('Shredder guide')).toBeInTheDocument();
    expect(screen.getByText('Unread', { selector: '[data-slot="badge"]' })).toBeInTheDocument();
    expect(screen.getByText(/20 Nov 2026/)).toBeInTheDocument();
  });

  it('shows empty states when there is nothing yet', () => {
    renderPage({
      notifications: [],
      stats: {
        ...stats,
        total: 0,
        read: [],
        types: [],
        preferences: { ...stats.preferences, total: 0 },
      },
    });

    expect(screen.getByText('No notifications found.')).toBeInTheDocument();
    expect(screen.getAllByText('No notifications yet.')).toHaveLength(2);
    expect(screen.getByText('No preferences saved yet.')).toBeInTheDocument();
  });
});
