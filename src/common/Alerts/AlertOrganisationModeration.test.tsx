import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import type { Moderation } from 'oa-shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AlertOrganisationModeration } from './AlertOrganisationModeration';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

vi.mock('oa-components', () => ({
  Banner: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InternalLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const renderWith = (moderation: Moderation | null, hasProfile = true) => {
  mockUseProfileStore.mockReturnValue({ profile: hasProfile ? { moderation } : null });
  return render(<AlertOrganisationModeration />);
};

const banner = (container: HTMLElement) =>
  container.querySelector('[data-cy="organisation-moderation-banner"]');

describe('AlertOrganisationModeration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('warns while the application is awaiting review', () => {
    const { container } = renderWith('awaiting-moderation');

    expect(banner(container)).toBeInTheDocument();
    expect(container.textContent).toContain('not visible to others');
  });

  it('warns while changes have been requested', () => {
    const { container } = renderWith('improvements-needed');

    expect(banner(container)).toBeInTheDocument();
  });

  it('links to the settings page for the detail', () => {
    const { container } = renderWith('awaiting-moderation');

    expect(container.querySelector('a[href="/settings/profile"]')).toBeInTheDocument();
  });

  it('says nothing once approved', () => {
    const { container } = renderWith('accepted');

    expect(banner(container)).toBeNull();
  });

  it('says nothing to a rejected applicant', () => {
    const { container } = renderWith('rejected');

    expect(banner(container)).toBeNull();
  });

  it('says nothing for a profile with no moderation state', () => {
    const { container } = renderWith(null);

    expect(banner(container)).toBeNull();
  });

  it('says nothing when signed out', () => {
    const { container } = renderWith(null, false);

    expect(banner(container)).toBeNull();
  });
});
