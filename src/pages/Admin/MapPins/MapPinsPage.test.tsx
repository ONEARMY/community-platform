import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { MapPinsPage } from './MapPinsPage';

describe('MapPinsPage', () => {
  const mockMapPins = [
    {
      id: 1,
      name: 'Precious Plastic Workshop',
      country: 'Netherlands',
      countryCode: 'nl',
      administrative: 'North Holland',
      postCode: '1012 JS',
      moderation: 'accepted',
      profileId: 101,
      profile: {
        id: 101,
        username: 'precious-workspace',
        displayName: 'Precious Workspace NL',
        profileType: {
          id: 2,
          name: 'workspace',
          displayName: 'Workspace',
          imageUrl: 'https://example.com/workspace.svg',
        },
      },
    },
    {
      id: 2,
      name: null,
      country: 'France',
      countryCode: 'fr',
      administrative: 'Île-de-France',
      postCode: '75001',
      moderation: 'awaiting-moderation',
      profileId: 102,
      profile: {
        id: 102,
        username: 'jean-dupont',
        displayName: 'Jean Dupont',
        profileType: {
          id: 1,
          name: 'member',
          displayName: 'Member',
          imageUrl: 'https://example.com/member.svg',
        },
      },
    },
  ];

  it('renders table headers and pin details', () => {
    render(
      <MemoryRouter>
        <MapPinsPage mapPins={mockMapPins} page={1} totalPages={1} totalCount={2} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Map Pins')).toBeInTheDocument();
    expect(screen.getByText('Total: 2')).toBeInTheDocument();
    expect(screen.getByText('Profile Type')).toBeInTheDocument();
    expect(screen.getByText('Precious Plastic Workshop')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('Netherlands')).toBeInTheDocument();
    expect(screen.getByText('North Holland')).toBeInTheDocument();
    expect(screen.getByText('1012 JS')).toBeInTheDocument();
    expect(screen.getByText('accepted')).toBeInTheDocument();
    expect(screen.getByText('awaiting-moderation')).toBeInTheDocument();
  });

  it('links to owning profile live page', () => {
    render(
      <MemoryRouter>
        <MapPinsPage mapPins={mockMapPins} page={1} totalPages={1} totalCount={2} />
      </MemoryRouter>,
    );

    const link = screen.getByText('Precious Workspace NL').closest('a');
    expect(link).toHaveAttribute('href', '/u/precious-workspace');
  });

  it('renders fallback for un-named pin and missing profile', () => {
    render(
      <MemoryRouter>
        <MapPinsPage
          mapPins={[
            {
              id: 3,
              name: null,
              country: 'Germany',
              administrative: null,
              postCode: null,
              moderation: 'accepted',
              profileId: 103,
              profile: null,
            },
          ]}
          page={1}
          totalPages={1}
          totalCount={1}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Profile #103')).toBeInTheDocument();
    const link = screen.getByText('Profile #103').closest('a');
    expect(link).toHaveAttribute('href', '/u/103');
  });

  it('renders empty state when no pins exist', () => {
    render(
      <MemoryRouter>
        <MapPinsPage mapPins={[]} page={1} totalPages={1} totalCount={0} />
      </MemoryRouter>,
    );

    expect(screen.getByText('No map pins found.')).toBeInTheDocument();
  });

  it('renders pagination controls when totalPages > 1', () => {
    render(
      <MemoryRouter>
        <MapPinsPage mapPins={mockMapPins} page={2} totalPages={5} totalCount={100} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
