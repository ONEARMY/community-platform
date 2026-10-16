import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ProfileListItem } from 'oa-shared';
import type { ReactNode } from 'react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ProfileList } from './profile-list';

const renderInRouter = (ui: ReactNode) => {
  const Stub = createRoutesStub([{ path: '/', Component: () => <>{ui}</> }]);
  return render(<Stub />);
};

const profiles: ProfileListItem[] = [
  {
    id: 1,
    username: 'test_user',
    displayName: 'Test User',
    photo: null,
    country: 'USA',
    badges: [],
    type: null,
  },
  {
    id: 2,
    username: 'example_user',
    displayName: 'Example User',
    photo: null,
    country: 'UK',
    badges: [],
    type: null,
  },
];

describe('ProfileList', () => {
  it('renders the header and profiles', () => {
    renderInRouter(<ProfileList profiles={profiles} header="Test Header" />);

    expect(screen.getByText('Test Header')).toBeInTheDocument();
    expect(screen.getByText('test_user')).toBeInTheDocument();
    expect(screen.getByText('example_user')).toBeInTheDocument();
  });

  it('shows no users message when profiles is empty', () => {
    renderInRouter(<ProfileList profiles={[]} header="Empty List" />);

    expect(screen.getByText('No users yet.')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    renderInRouter(<ProfileList profiles={[]} header="Close Test" onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalled();
  });
});
