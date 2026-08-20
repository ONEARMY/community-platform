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

const renderWith = (
  moderation: Moderation | null,
  emailFrom = 'hello@example.com',
  moderationFeedback: string | null = null,
) => {
  mockUseProfileStore.mockReturnValue({ profile: { moderation, moderationFeedback } });
  return render(
    <TenantContext.Provider value={{ emailFrom } as never}>
      <OrganisationModerationSection />
    </TenantContext.Provider>,
  );
};

const banner = (container: HTMLElement) =>
  container.querySelector('[data-cy="organisation-moderation-details"]');

const feedback = (container: HTMLElement) =>
  container.querySelector('[data-cy="organisation-moderation-feedback"]');

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

  it('shows the moderator feedback inline when there is some', () => {
    const { container } = renderWith(
      'improvements-needed',
      'hello@example.com',
      'The pictures do not show a workspace.',
    );

    expect(feedback(container)).toBeInTheDocument();
    expect(container.textContent).toContain('Moderator feedback');
    expect(container.textContent).toContain('The pictures do not show a workspace.');
    expect(container.textContent).not.toContain('Check your email');
  });

  it('falls back to pointing at email when the moderator left no feedback', () => {
    const { container } = renderWith('improvements-needed');

    expect(feedback(container)).toBeNull();
    expect(container.textContent).toContain('Check your email');
  });

  it('ignores whitespace-only feedback', () => {
    const { container } = renderWith('improvements-needed', 'hello@example.com', '   ');

    expect(feedback(container)).toBeNull();
    expect(container.textContent).toContain('Check your email');
  });

  it('does not show feedback while still awaiting moderation', () => {
    const { container } = renderWith(
      'awaiting-moderation',
      'hello@example.com',
      'Stale note from a previous round.',
    );

    expect(feedback(container)).toBeNull();
    expect(container.textContent).not.toContain('Stale note from a previous round.');
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
