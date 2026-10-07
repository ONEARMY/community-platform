import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileBadge } from 'oa-shared';
import { ProfileBadgeService } from 'src/services/profileBadgeService';
import type { AdminProfileBadge } from 'src/utils/profileBadges';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadgeFormDialog } from './BadgeFormDialog';

const mockToast = vi.hoisted(() => ({ promise: vi.fn() }));

vi.mock('react-router', () => ({ useRevalidator: () => ({ revalidate: vi.fn() }) }));
vi.mock('src/common/Toast/useToast', () => ({ useToast: () => mockToast }));
vi.mock('src/pages/common/ImagePicker/ImagePickerDialog', () => ({ ImagePickerDialog: () => null }));
vi.mock('src/services/profileBadgeService', () => ({
  ProfileBadgeService: {
    createProfileBadge: vi.fn().mockResolvedValue({}),
    updateProfileBadge: vi.fn().mockResolvedValue({}),
  },
}));

const adminBadge = (
  badge: Partial<ProfileBadge> & { id: number },
  usage: Partial<AdminProfileBadge['usage']> = {},
): AdminProfileBadge => ({
  badge: new ProfileBadge({
    name: `badge-${badge.id}`,
    displayName: `Badge ${badge.id}`,
    imageUrl: 'https://example.com/badge.svg',
    isAudience: true,
    ...badge,
  }),
  usage: { holders: 0, articles: 0, stripeLinked: false, ...usage },
});

const member = adminBadge(
  {
    id: 1,
    name: 'member',
    displayName: 'Member',
    actionUrl: '/support',
    availableTo: 'non_space',
    actionLabel: 'Become a member',
  },
  { articles: 2 },
);
const pro = adminBadge({ id: 2, name: 'pro', displayName: 'PRO', grantsBadgeId: 1 });
const tier = adminBadge({
  id: 3,
  displayName: 'Start',
  isAudience: false,
  grantsBadgeId: 1,
  premiumTier: 1,
});
const unused = adminBadge({ id: 4, displayName: 'Unused' });
const profileBadges = [member, pro, tier, unused];

const renderDialog = (profileBadge: AdminProfileBadge | null) =>
  render(
    <BadgeFormDialog
      open
      profileBadge={profileBadge}
      profileBadges={profileBadges}
      onOpenChange={vi.fn()}
    />,
  );

const textbox = (name: string) => screen.findByRole('textbox', { name });

describe('BadgeFormDialog', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not allow renaming an existing badge', async () => {
    renderDialog(unused);

    expect(await textbox('Name')).toBeDisabled();
  });

  it('hides the offer fields for badges that cannot restrict news', async () => {
    renderDialog(tier);

    await textbox('Display Name');
    expect(screen.queryByText('Offered To')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Button Label' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Premium Tier' })).toHaveValue('1');
  });

  it('asks for a button label only when the badge is offered', async () => {
    const { unmount } = renderDialog(member);
    expect(await textbox('Button Label')).toHaveValue('Become a member');
    unmount();

    renderDialog(unused);
    await textbox('Display Name');
    expect(screen.queryByRole('textbox', { name: 'Button Label' })).not.toBeInTheDocument();
  });

  it('locks the audience checkbox while the badge is used on news', async () => {
    renderDialog(member);

    expect(await screen.findByRole('checkbox', { name: 'Can restrict news' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByText(/Locked: used on 2 news articles/)).toBeInTheDocument();
  });

  it('offers only audience badges that do not create a cycle as grant targets', async () => {
    renderDialog(member);

    await userEvent.click(await screen.findByRole('combobox', { name: 'Grants Access To' }));

    const options = (await screen.findAllByRole('option')).map((option) => option.textContent);
    expect(options).toEqual(['None', 'Unused']);
  });

  it('shows a field error once the field is left', async () => {
    renderDialog(null);

    const name = await textbox('Name');
    await userEvent.type(name, 'Not Valid');

    expect(name).not.toHaveAccessibleDescription();

    await userEvent.tab();

    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Use lowercase letters, numbers and dashes only');
    expect(screen.queryByText('Display name is required')).not.toBeInTheDocument();
  });

  it('shows every field error instead of submitting', async () => {
    renderDialog(member);

    await userEvent.clear(await textbox('Button Label'));
    await userEvent.clear(screen.getByRole('textbox', { name: 'Link' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('textbox', { name: 'Button Label' })).toHaveAccessibleDescription(
      'A button label is required when the badge is offered',
    );
    expect(screen.getByRole('textbox', { name: 'Link' })).toHaveAccessibleDescription(
      'A link is required when the badge is offered',
    );
    expect(ProfileBadgeService.updateProfileBadge).not.toHaveBeenCalled();
  });

  it('submits a normalized payload', async () => {
    renderDialog(unused);

    const displayName = await textbox('Display Name');
    await userEvent.clear(displayName);
    await userEvent.type(displayName, '  Renamed  ');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(ProfileBadgeService.updateProfileBadge).toHaveBeenCalledWith(4, {
      name: 'badge-4',
      displayName: 'Renamed',
      imageUrl: 'https://example.com/badge.svg',
      actionUrl: null,
      isAudience: true,
      grantsBadgeId: null,
      availableTo: null,
      actionLabel: null,
    });
    expect(mockToast.promise).toHaveBeenCalled();
  });
});
