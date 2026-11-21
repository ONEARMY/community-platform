import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UserEngagementWrapper } from '@/components/ui/user-engagement-wrapper';

describe('UserEngagementWrapper', () => {
  it('renders the children', () => {
    const { getByText } = render(
      <UserEngagementWrapper>
        <button type="button">Mark as useful</button>
      </UserEngagementWrapper>,
    );

    expect(getByText('Mark as useful')).toBeInTheDocument();
  });
});