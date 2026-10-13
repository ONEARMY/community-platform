import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import type { AdminNews } from 'oa-shared';
import { MemoryRouter } from 'react-router';
import { FactoryAdminNews } from 'src/test/factories/News';
import { describe, expect, it } from 'vitest';
import { NewsPage } from './NewsPage';

const mockNews = FactoryAdminNews({
  id: 1,
  title: 'Community Update #1',
  slug: 'community-update-1',
  category: { id: 10, name: 'Updates' },
  tags: ['announcement', 'community'],
  moderation: 'accepted',
  isDraft: false,
  publishedAt: new Date('2026-08-20T10:00:00Z'),
  commentCount: 5,
  totalViews: 120,
  hasPoll: true,
  deleted: false,
  authorDisplayName: 'Jane Doe',
  authorUserName: 'janedoe',
});

const renderPage = (news: AdminNews[]) =>
  render(
    <MemoryRouter>
      <NewsPage news={news} />
    </MemoryRouter>,
  );

describe('NewsPage', () => {
  it('renders table headers and news post details', () => {
    renderPage([mockNews]);
    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Community Update #1' })).toHaveAttribute(
      'href',
      '/news/community-update-1',
    );
    expect(screen.getByRole('link', { name: 'Jane Doe' })).toHaveAttribute('href', '/u/janedoe');
    expect(screen.getByText('Updates')).toBeInTheDocument();
    expect(screen.getByText('announcement, community')).toBeInTheDocument();
    expect(screen.getByText('accepted')).toBeInTheDocument();
    expect(screen.getByText('20 Aug 2026')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    const cells = screen.getAllByRole('cell');
    expect(cells[5]).toHaveTextContent('No');
    expect(cells[9]).toHaveTextContent('Yes');
  });

  it('renders an author without a username as plain text', () => {
    renderPage([
      FactoryAdminNews({
        ...mockNews,
        authorDisplayName: 'Jane Doe',
        authorUserName: null,
      }),
    ]);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Jane Doe' })).not.toBeInTheDocument();
  });

  it('renders fallback when author is unavailable', () => {
    renderPage([
      FactoryAdminNews({
        ...mockNews,
        authorDisplayName: null,
        authorUserName: null,
      }),
    ]);
    expect(screen.queryByRole('link', { name: 'Jane Doe' })).not.toBeInTheDocument();
  });

  it('renders fallback when category is unavailable', () => {
    renderPage([FactoryAdminNews({ ...mockNews, category: null })]);
    expect(screen.queryByText('Updates')).not.toBeInTheDocument();
  });

  it('renders fallback when tags are empty', () => {
    renderPage([FactoryAdminNews({ ...mockNews, tags: [] })]);
    expect(screen.queryByText('announcement, community')).not.toBeInTheDocument();
  });

  it('renders moderation status badges and fallback', () => {
    renderPage([
      FactoryAdminNews({ ...mockNews, moderation: 'awaiting-moderation' }),
      FactoryAdminNews({ ...mockNews, id: 2, moderation: 'improvements-needed' }),
      FactoryAdminNews({ ...mockNews, id: 3, moderation: 'rejected' }),
      FactoryAdminNews({ ...mockNews, id: 4, moderation: null }),
    ]);
    expect(screen.getByText('awaiting-moderation')).toBeInTheDocument();
    expect(screen.getByText('improvements-needed')).toBeInTheDocument();
    expect(screen.getByText('rejected')).toBeInTheDocument();
  });

  it('renders draft state and date fallback', () => {
    renderPage([
      FactoryAdminNews({
        ...mockNews,
        isDraft: true,
        publishedAt: null,
      }),
    ]);
    const cells = screen.getAllByRole('cell');
    expect(cells[5]).toHaveTextContent('Yes');
    expect(cells[6]).toHaveTextContent('—');
  });

  it('renders poll as No when post does not have a poll', () => {
    renderPage([FactoryAdminNews({ ...mockNews, hasPoll: false })]);
    const cells = screen.getAllByRole('cell');
    expect(cells[9]).toHaveTextContent('No');
  });

  it('renders deleted post with muted styling', () => {
    renderPage([FactoryAdminNews({ ...mockNews, deleted: true })]);
    const row = screen.getByRole('row', { name: /Community Update #1/ });
    expect(row).toHaveClass('text-muted-foreground');
  });

  it('renders empty state when there are no news posts', () => {
    renderPage([]);
    expect(screen.getByText('No news yet.')).toBeInTheDocument();
  });

  it('has no create, edit or delete controls', () => {
    renderPage([mockNews]);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
