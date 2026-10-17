import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import type { AdminComment } from 'oa-shared';
import { MemoryRouter } from 'react-router';
import { FactoryAdminComment } from 'src/test/factories/Comment';
import { describe, expect, it } from 'vitest';
import { CommentsPage } from './CommentsPage';

const comment = FactoryAdminComment({
  comment: 'Have you tried a finer mesh?',
  sourceType: 'research_updates',
  createdAt: new Date('2026-08-20T10:00:00Z'),
  liveUrl: '/research/shredder?update_3#comment:7',
  notificationCount: 4,
  author: { username: 'maker', displayName: 'Maker One' },
});

const renderPage = (comments: AdminComment[], page = 1, totalPages = 1) =>
  render(
    <MemoryRouter>
      <CommentsPage comments={comments} page={page} totalPages={totalPages} />
    </MemoryRouter>,
  );

describe('CommentsPage', () => {
  it('lists each comment with its type, live link, creator, date and notification count', () => {
    renderPage([comment]);

    expect(screen.getByRole('heading', { name: 'Comments' })).toBeInTheDocument();
    expect(screen.getByText('Research update')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Have you tried a finer mesh?' })).toHaveAttribute(
      'href',
      '/research/shredder?update_3#comment:7',
    );
    expect(screen.getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');
    expect(screen.getByText('20 Aug 2026')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('marks replies', () => {
    renderPage([FactoryAdminComment({ ...comment, isReply: true })]);

    expect(screen.getByText('Research update (reply)')).toBeInTheDocument();
  });

  it('shows the text without a link when the source is unavailable', () => {
    renderPage([FactoryAdminComment({ ...comment, liveUrl: null })]);

    expect(screen.getByText('Have you tried a finer mesh?')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Have you tried a finer mesh?' }),
    ).not.toBeInTheDocument();
  });

  it('shows an empty state', () => {
    renderPage([]);

    expect(screen.getByText('No comments yet.')).toBeInTheDocument();
  });

  it('paginates', () => {
    renderPage([comment], 2, 3);

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Previous/ })).toHaveAttribute('href', '/?page=1');
    expect(screen.getByRole('button', { name: /Next/ })).toHaveAttribute('href', '/?page=3');
  });
});
