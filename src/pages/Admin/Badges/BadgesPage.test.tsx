import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileBadge } from 'oa-shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadgesPage } from './BadgesPage';

const mockToast = vi.hoisted(() => ({ info: vi.fn() }));
const mockDeleteDialog = vi.hoisted(() => vi.fn());

vi.mock('src/common/Toast', () => ({ useToast: () => mockToast }));
vi.mock('./BadgeFormDialog', () => ({ BadgeFormDialog: () => null }));
vi.mock('./DeleteBadgeDialog', () => ({
  DeleteBadgeDialog: (props: any) => {
    mockDeleteDialog(props);
    return null;
  },
}));

const profileBadges = [
  {
    badge: new ProfileBadge({
      id: 1,
      name: 'member',
      displayName: 'Member',
      imageUrl: 'https://example.com/member.svg',
      isAudience: true,
      availableTo: 'non_space',
      actionLabel: 'Become a member',
    }),
    usage: { holders: 0, articles: 4, stripeLinked: false },
  },
  {
    badge: new ProfileBadge({
      id: 2,
      name: 'stripe-tier-1',
      displayName: 'Start',
      imageUrl: 'https://example.com/start.svg',
      isAudience: false,
      grantsBadgeId: 1,
    }),
    usage: { holders: 12, articles: 0, stripeLinked: true },
  },
  {
    badge: new ProfileBadge({
      id: 3,
      name: 'unused',
      displayName: 'Unused',
      imageUrl: 'https://example.com/unused.svg',
      isAudience: true,
    }),
    usage: { holders: 0, articles: 0, stripeLinked: false },
  },
];

const row = (name: string) => screen.getByRole('row', { name: new RegExp(`^${name}`) });

describe('BadgesPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows how each badge is configured and used', () => {
    render(<BadgesPage profileBadges={profileBadges} />);

    const member = within(row('Member'));
    expect(member.getByText('Non-spaces')).toBeInTheDocument();
    expect(member.getByText('4')).toBeInTheDocument();

    const start = within(row('Start'));
    expect(start.getByText('stripe-tier-1')).toBeInTheDocument();
    expect(start.getByText('Member')).toBeInTheDocument();
    expect(start.getByText('12')).toBeInTheDocument();
  });

  it('explains why a badge in use cannot be deleted', async () => {
    render(<BadgesPage profileBadges={profileBadges} />);

    await userEvent.click(screen.getByRole('button', { name: "Can't delete Start" }));

    expect(mockToast.info).toHaveBeenCalledWith(expect.stringContaining('held by 12 profiles'));
    expect(mockToast.info).toHaveBeenCalledWith(expect.stringContaining('linked to Stripe'));
  });

  it('opens the delete dialog for an unused badge', async () => {
    render(<BadgesPage profileBadges={profileBadges} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete Unused' }));

    expect(mockDeleteDialog).toHaveBeenLastCalledWith(
      expect.objectContaining({ profileBadge: profileBadges[2] }),
    );
  });
});
