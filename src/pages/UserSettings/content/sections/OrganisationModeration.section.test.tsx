import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import type { Moderation } from 'oa-shared';
import { TenantContext } from 'src/pages/common/TenantContext';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrganisationModerationSection } from './OrganisationModeration.section';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

const renderWith = (moderation: Moderation | null, emailFrom = 'hello@example.com') => {
  mockUseProfileStore.mockReturnValue({ profile: { moderation } });
  return render(
    <TenantContext.Provider value={{ emailFrom } as never}>
      <OrganisationModerationSection />
    </TenantContext.Provider>,
  );
};

const banner = (container: HTMLElement) =>
  container.querySelector('[data-cy="organisation-moderation-details"]');

describe('OrganisationModerationSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the review message for awaiting-moderation', () => {
    const { container } = renderWith('awaiting-moderation');

    expect(banner(container)).toBeInTheDocument();
    expect(container.textContent).toContain('being reviewed');
    expect(container.querySelector('a[href="mailto:hello@example.com"]')).toBeInTheDocument();
  });

  it('shows the needs-changes message for improvements-needed', () => {
    const { container } = renderWith('improvements-needed');

    expect(banner(container)).toBeInTheDocument();
    expect(container.textContent).toContain('needs changes');
    expect(container.textContent).toContain('save your profile and send the application again');
    expect(container.textContent).toContain('your profile is not visible to others');
  });

  it('omits the contact clause when no tenant email is set', () => {
    const { container } = renderWith('awaiting-moderation', '');

    expect(banner(container)).toBeInTheDocument();
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it('renders nothing when accepted', () => {
    const { container } = renderWith('accepted');

    expect(banner(container)).toBeNull();
  });

  it('renders nothing when there is no moderation status', () => {
    const { container } = renderWith(null);

    expect(banner(container)).toBeNull();
  });
});
