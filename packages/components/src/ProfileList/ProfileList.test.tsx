import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { ProfileList } from './ProfileList';

import type { ProfileListItem } from 'oa-shared';

describe('ProfileList', () => {
  it('renders the header and profiles', () => {
    const mockProfiles: ProfileListItem[] = [
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
    const { getByText } = render(<ProfileList profiles={mockProfiles} header="Test Header" />);
    expect(getByText('Test Header')).toBeInTheDocument();
    expect(getByText('test_user')).toBeInTheDocument();
    expect(getByText('example_user')).toBeInTheDocument();
  });

  it('shows no users message when profiles is empty', () => {
    const { getByText } = render(<ProfileList profiles={[]} header="Empty List" />);
    expect(getByText('No users yet.')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <ProfileList profiles={[]} header="Close Test" onClose={onClose} />,
    );
    // Click the close button
    const closeButton = getByRole('button');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
