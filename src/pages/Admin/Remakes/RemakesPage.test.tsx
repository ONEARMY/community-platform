import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import type { AdminRemake } from 'oa-shared';
import { MemoryRouter } from 'react-router';
import { FactoryAdminRemake } from 'src/test/factories/Remake';
import { describe, expect, it } from 'vitest';
import { RemakesPage } from './RemakesPage';

const remake = FactoryAdminRemake({
  createdAt: new Date('2026-08-20T10:00:00Z'),
  description: 'Made this at our local workshop.',
  imageUrl: 'https://example.com/remake-1.webp',
  project: { slug: 'plastic-bench', title: 'Plastic bench', deleted: false },
  author: { username: 'maker', displayName: 'Maker One' },
});

const renderPage = (remakes: AdminRemake[]) =>
  render(
    <MemoryRouter>
      <RemakesPage remakes={remakes} />
    </MemoryRouter>,
  );

describe('RemakesPage', () => {
  it('lists each remake with its project, creator, description, image and date', () => {
    renderPage([remake]);

    expect(screen.getByRole('heading', { name: 'Remakes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Plastic bench' })).toHaveAttribute(
      'href',
      '/library/plastic-bench#remakes',
    );
    expect(screen.getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');
    expect(screen.getByText('Made this at our local workshop.')).toHaveAttribute(
      'title',
      'Made this at our local workshop.',
    );
    expect(screen.getByRole('img', { name: 'Remake by Maker One' })).toHaveAttribute(
      'src',
      'https://example.com/remake-1.webp',
    );
    expect(screen.getByText('20 Aug 2026')).toBeInTheDocument();
  });

  it('shows a placeholder when the remake has no image', () => {
    renderPage([FactoryAdminRemake({ ...remake, imageUrl: null })]);

    expect(screen.getByRole('img', { name: 'No image' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Remake by Maker One' })).not.toBeInTheDocument();
  });

  it('renders a creator without a username as plain text', () => {
    renderPage([FactoryAdminRemake({ ...remake, author: { displayName: 'Maker One', username: null } })]);

    expect(screen.getByText('Maker One')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Maker One' })).not.toBeInTheDocument();
  });

  it('renders a project marked for deletion as plain text', () => {
    renderPage([
      FactoryAdminRemake({
        ...remake,
        project: { slug: 'plastic-bench', title: 'Plastic bench', deleted: true },
      }),
    ]);

    expect(screen.getByText('Plastic bench (marked for deletion)')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Plastic bench' })).not.toBeInTheDocument();
  });

  it('renders a remake without a description', () => {
    renderPage([FactoryAdminRemake({ ...remake, description: null })]);

    const cells = screen.getAllByRole('cell');
    expect(cells[3]).toBeEmptyDOMElement();
    expect(cells[3]).not.toHaveAttribute('title');
  });

  it('keeps an unavailable project visible without a project link', () => {
    renderPage([FactoryAdminRemake({ ...remake, project: null })]);

    expect(screen.getByText('Project unavailable')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');
    expect(screen.getByText('Made this at our local workshop.')).toBeInTheDocument();
  });

  it('keeps an unavailable creator visible without a profile link', () => {
    renderPage([FactoryAdminRemake({ ...remake, author: null })]);

    expect(screen.getByText('Creator unavailable')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Plastic bench' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Remake' })).toHaveAttribute('src', remake.imageUrl);
  });

  it('keeps the row and its content when both joins are unavailable', () => {
    renderPage([FactoryAdminRemake({ ...remake, project: null, author: null })]);

    expect(screen.getByText('Project unavailable')).toBeInTheDocument();
    expect(screen.getByText('Creator unavailable')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getAllByRole('cell')).toHaveLength(5);
    expect(screen.getByText('Made this at our local workshop.')).toBeInTheDocument();
  });

  it('shows an empty state when there are no remakes', () => {
    renderPage([]);

    expect(screen.getByText('No remakes yet.')).toBeInTheDocument();
  });

  it('has no create, edit or delete controls', () => {
    renderPage([remake]);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
