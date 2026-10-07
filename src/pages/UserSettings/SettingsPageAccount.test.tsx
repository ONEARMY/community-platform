import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';
import { SettingsPageAccount } from './SettingsPageAccount';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({ useProfileStore: mockUseProfileStore }));
vi.mock('src/services/stripeService', () => ({
  stripeService: {
    getSubscriptionStatus: vi.fn().mockResolvedValue({ hasSubscription: true, subscription: null }),
  },
}));
vi.mock('./content/sections/ChangeEmail.form', () => ({ ChangeEmailForm: () => null }));
vi.mock('./content/sections/ChangePassword.form', () => ({ ChangePasswordForm: () => null }));
vi.mock('./content/sections/DeleteAccount.form', () => ({ DeleteAccountForm: () => null }));

const tier = (premiumTier: number, displayName: string) => ({
  id: premiumTier,
  name: `stripe-tier-${premiumTier}`,
  displayName,
  imageUrl: `https://example.com/${displayName}.svg`,
  premiumTier,
});

const renderPage = (badges: ReturnType<typeof tier>[]) => {
  mockUseProfileStore.mockReturnValue({ profile: FactoryUser({ badges }) });

  render(
    <ThemeProvider theme={theme}>
      <SettingsPageAccount />
    </ThemeProvider>,
  );
};

describe('SettingsPageAccount', () => {
  it("shows the subscriber's highest tier badge", async () => {
    renderPage([tier(1, 'Start'), tier(3, 'Boost')]);

    await screen.findByText('Manage your subscription');
    expect(screen.getByAltText('Boost')).toHaveAttribute('src', 'https://example.com/Boost.svg');
    expect(screen.queryByAltText('Start')).not.toBeInTheDocument();
  });

  it('falls back to the supporter icon without a tier badge', async () => {
    renderPage([]);

    await screen.findByText('Manage your subscription');
    expect(document.querySelector('img')).not.toBeInTheDocument();
  });
});
