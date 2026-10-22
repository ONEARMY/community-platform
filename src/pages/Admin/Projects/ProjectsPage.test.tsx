import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import type { AdminProject } from 'oa-shared';
import { MemoryRouter } from 'react-router';
import { FactoryAdminProject } from 'src/test/factories/Library';
import { describe, expect, it } from 'vitest';
import { ProjectsPage } from './ProjectsPage';

const project = FactoryAdminProject({
  title: 'Plastic bench',
  slug: 'plastic-bench',
  author: { username: 'maker', displayName: 'Maker One' },
  category: 'Furniture',
  difficultyLevel: 'very-hard',
  moderation: 'awaiting-moderation',
  publishedAt: new Date('2026-08-20T10:00:00Z'),
  stepCount: 7,
  commentCount: 12,
  totalViews: 345,
  remakeCount: 2,
});

const renderPage = (projects: AdminProject[], page = 1, totalPages = 1) =>
  render(
    <MemoryRouter>
      <ProjectsPage
        projects={projects}
        page={page}
        totalPages={totalPages}
        totalCount={projects.length}
      />
    </MemoryRouter>,
  );

const cellsOf = (title: string) =>
  within(screen.getByText(title).closest('tr')!).getAllByRole('cell');

describe('ProjectsPage', () => {
  it('lists each project with its details', () => {
    renderPage([project]);

    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');
    expect(cellsOf('Plastic bench').map((cell) => cell.textContent)).toEqual([
      'Plastic bench',
      'Maker One',
      'Furniture',
      'Very Hard',
      'awaiting-moderation',
      '20 Aug 2026',
      '7',
      '12',
      '345',
      '2',
    ]);
  });

  it('links each project to its live page', () => {
    renderPage([project]);

    expect(screen.getByRole('link', { name: 'Plastic bench' })).toHaveAttribute(
      'href',
      '/library/plastic-bench',
    );
  });

  it('shows drafts as Draft instead of a published date', () => {
    renderPage([FactoryAdminProject({ ...project, isDraft: true, publishedAt: null })]);

    expect(cellsOf('Plastic bench')[5]).toHaveTextContent('Draft');
  });

  it('greys out a deleted project and does not link to it', () => {
    renderPage([FactoryAdminProject({ ...project, deleted: true })]);

    expect(screen.getByText('Plastic bench (marked for deletion)').closest('tr')).toHaveClass(
      'bg-muted',
    );
    expect(screen.queryByRole('link', { name: 'Plastic bench' })).not.toBeInTheDocument();
  });

  it('leaves optional fields empty when a project has none', () => {
    renderPage([
      FactoryAdminProject({
        ...project,
        category: null,
        difficultyLevel: null,
        moderation: null,
        publishedAt: null,
      }),
    ]);

    const cells = cellsOf('Plastic bench');
    for (const index of [2, 3, 4, 5]) {
      expect(cells[index]).toBeEmptyDOMElement();
    }
  });

  it('keeps an unavailable author visible without a profile link', () => {
    renderPage([FactoryAdminProject({ ...project, author: null })]);

    expect(screen.getByText('Author unavailable')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('renders an author without a username as plain text', () => {
    renderPage([FactoryAdminProject({ ...project, author: { displayName: 'Maker One', username: null } })]);

    expect(screen.getByText('Maker One')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Maker One' })).not.toBeInTheDocument();
  });

  it('shows an empty state when there are no projects', () => {
    renderPage([]);

    expect(screen.getByText('No projects yet.')).toBeInTheDocument();
  });

  it('has no create, edit or delete controls', () => {
    renderPage([project]);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('pages through the projects', () => {
    renderPage([project], 2, 3);

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Previous').closest('a')).toHaveAttribute('href', '/?page=1');
    expect(screen.getByText('Next').closest('a')).toHaveAttribute('href', '/?page=3');
  });
});
