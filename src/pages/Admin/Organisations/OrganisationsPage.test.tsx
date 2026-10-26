import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { FactoryAdminOrganisation } from 'src/test/factories/profile';
import { OrganisationsPage } from './OrganisationsPage';

const organisations = [
  FactoryAdminOrganisation({
    id: 7,
    username: 'acme-lab',
    displayName: 'Acme Lab',
    about: 'We shred plastic',
    typeName: 'Workspace',
    moderation: 'improvements-needed',
    moderationFeedback: 'Add a cover photo',
    createdAt: new Date('2026-10-12T10:00:00.000Z'),
    isMapPin: true,
  }),
];

const renderPage = (
  props: Partial<Parameters<typeof OrganisationsPage>[0]> = {},
  url = '/admin/organisations?status=improvements-needed',
) => {
  const router = createMemoryRouter(
    [
      {
        path: '/admin/organisations',
        element: (
          <OrganisationsPage
            organisations={organisations}
            status="improvements-needed"
            search={null}
            page={1}
            totalPages={1}
            {...props}
          />
        ),
      },
    ],
    { initialEntries: [url] },
  );

  render(<RouterProvider router={router} />);
  return router;
};

describe('OrganisationsPage', () => {
  it('shows each organisation with its status and feedback', () => {
    renderPage();

    expect(screen.getByRole('link', { name: 'Acme Lab' })).toHaveAttribute('href', '/u/acme-lab');
    expect(screen.getByText('@acme-lab')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getAllByText('Improvements Needed').length).toBeGreaterThan(0);
    expect(screen.getByText('Add a cover photo')).toBeInTheDocument();
    expect(screen.getByText('12 Oct 2026')).toBeInTheDocument();
    expect(screen.getByText('Map pin only')).toBeInTheDocument();
  });

  it('shows an empty state', () => {
    renderPage({ organisations: [] });

    expect(screen.getByText('No organisations found.')).toBeInTheDocument();
  });

  it('opens the moderate dialog with the current status and feedback', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Moderate' }));

    expect(await screen.findByText('Moderate Acme Lab')).toBeInTheDocument();
    expect(screen.getByLabelText('Feedback (required)')).toHaveValue('Add a cover photo');
  });

  it('keeps the status filter when paging', () => {
    renderPage({ page: 1, totalPages: 2 });

    expect(screen.getByText('Next').closest('a')).toHaveAttribute(
      'href',
      '/admin/organisations?status=improvements-needed&page=2',
    );
  });

  it('searches within the chosen status', () => {
    const router = renderPage();

    fireEvent.change(screen.getByLabelText('Search organisations'), { target: { value: ' acme ' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(router.state.location.search).toBe('?status=improvements-needed&q=acme');
  });

  it('searches every status from the default view', () => {
    const router = renderPage({ status: 'awaiting-moderation' }, '/admin/organisations');

    fireEvent.change(screen.getByLabelText('Search organisations'), { target: { value: 'acme' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(router.state.location.search).toBe('?q=acme');
  });

  it('keeps the search when paging', () => {
    renderPage({ status: 'all', search: 'acme', totalPages: 2 }, '/admin/organisations?q=acme');

    expect(screen.getByText('Next').closest('a')).toHaveAttribute(
      'href',
      '/admin/organisations?q=acme&page=2',
    );
  });
});
