import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProfileLink } from './profile-link';

describe('ProfileLink', () => {
  it('renders external link with correct attributes and text', () => {
    const { getByRole } = render(<ProfileLink url="https://example.com" />);

    const link = getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('data-cy', 'profile-website');
  });

  it('renders slot data attribute on root', () => {
    const { container } = render(<ProfileLink url="https://example.com" />);

    expect(container.querySelector('[data-slot="profile-link"]')).toBeInTheDocument();
  });
});
