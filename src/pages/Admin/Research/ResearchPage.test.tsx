import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { AdminResearchItem } from './ResearchPage';
import { ResearchPage } from './ResearchPage';

const item: AdminResearchItem = {
  id: 1,
  title: 'Shredder gearbox',
  slug: 'shredder-gearbox',
  status: 'in-progress',
  isDraft: false,
  deleted: false,
  publishedAt: '2026-08-20T10:00:00Z',
  createdAt: '2026-08-01T10:00:00Z',
  totalViews: 120,
  totalUseful: 7,
  updateCount: 3,
  collaboratorCount: 0,
  category: 'Machines',
  author: { username: 'maker', displayName: 'Maker One' },
};

const renderPage = (research: AdminResearchItem[], page = 1, totalPages = 1) =>
  render(
    <MemoryRouter>
      <ResearchPage
        research={research}
        page={page}
        totalPages={totalPages}
        totalCount={research.length}
      />
    </MemoryRouter>,
  );

describe('ResearchPage', () => {
  it('lists each research topic with its details and a link to the live page', () => {
    renderPage([item]);

    expect(screen.getByRole('heading', { name: 'Research' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shredder gearbox' })).toHaveAttribute(
      'href',
      '/research/shredder-gearbox',
    );
    expect(screen.getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');

    const row = screen.getByRole('row', { name: /Shredder gearbox/ });
    expect(within(row).getByText('Machines')).toBeInTheDocument();
    expect(within(row).getByText('In progress')).toBeInTheDocument();
    expect(within(row).getByText('Published')).toBeInTheDocument();
    expect(within(row).getByText('120')).toBeInTheDocument();
    expect(within(row).getByText('7')).toBeInTheDocument();
    expect(within(row).getByText('3')).toBeInTheDocument();
    expect(within(row).getByText('20 Aug 2026')).toBeInTheDocument();
  });

  it('marks drafts', () => {
    renderPage([{ ...item, isDraft: true }]);

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.queryByText('Published')).not.toBeInTheDocument();
  });

  it('shows that a topic has collaborators', () => {
    renderPage([{ ...item, collaboratorCount: 2 }]);

    expect(screen.getByTitle('2 collaborators')).toBeInTheDocument();
  });

  it('shows no collaborators indicator when there are none', () => {
    renderPage([item]);

    expect(screen.queryByTitle(/collaborators/)).not.toBeInTheDocument();
  });

  it('keeps a soft-deleted topic in the list but greyed out', () => {
    renderPage([{ ...item, deleted: true }]);

    const row = screen.getByRole('row', { name: /Shredder gearbox/ });
    expect(row).toHaveClass('text-muted-foreground');
    expect(within(row).getByText('Deleted')).toBeInTheDocument();
  });

  it('does not grey out an active topic', () => {
    renderPage([item]);

    expect(screen.getByRole('row', { name: /Shredder gearbox/ })).not.toHaveClass('text-muted-foreground');
  });

  it('renders an author without a username as plain text', () => {
    renderPage([{ ...item, author: { username: null, displayName: 'Maker One' } }]);

    expect(screen.getByText('Maker One')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Maker One' })).not.toBeInTheDocument();
  });

  it('has no create, edit or delete controls', () => {
    renderPage([item]);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows an empty state', () => {
    renderPage([]);

    expect(screen.getByText('No research found.')).toBeInTheDocument();
  });

  it('links to the neighbouring pages', () => {
    renderPage([item], 2, 3);

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Previous').closest('a')).toHaveAttribute(
      'href',
      '/admin/research?page=1',
    );
    expect(screen.getByText('Next').closest('a')).toHaveAttribute('href', '/admin/research?page=3');
  });

  it('hides pagination when there is one page', () => {
    renderPage([item]);

    expect(screen.queryByText(/Page 1 of/)).not.toBeInTheDocument();
  });
});
