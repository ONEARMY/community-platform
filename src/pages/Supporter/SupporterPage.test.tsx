import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TenantContext } from 'src/pages/common/TenantContext';
import { SupporterPage } from './SupporterPage';
import type { SupporterPrice } from 'src/services/stripeService.server';

const mockCreateElementsSubscription = vi.fn();
const mockCreateSupporterAccount = vi.fn();

vi.mock('src/services/stripeService', () => ({
  stripeService: {
    createElementsSubscription: (...args: unknown[]) =>
      mockCreateElementsSubscription(...args),
    createSupporterAccount: (...args: unknown[]) =>
      mockCreateSupporterAccount(...args),
    linkExistingAccount: vi.fn(),
    setPassword: vi.fn(),
    getSubscriptionStatus: vi.fn(),
    createPortalSession: vi.fn(),
  },
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => ({
    confirmPayment: vi.fn(() => Promise.resolve({})),
  }),
  useElements: () => ({}),
}));

vi.mock('sonner', () => ({
  toast: { custom: vi.fn() },
}));

vi.mock('src/common/Toast/useToast', () => ({
  useToast: () => ({
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('src/common/Toast/CustomToast', () => ({
  CustomToast: () => null,
}));

const mockPrices: SupporterPrice[] = [
  {
    id: 'price_1a',
    unitAmount: 800,
    currency: 'eur',
    interval: 'month',
    tier: 1,
    tierName: 'starter',
  },
  {
    id: 'price_1b',
    unitAmount: 1500,
    currency: 'eur',
    interval: 'month',
    tier: 1,
    tierName: 'starter',
  },
  {
    id: 'price_2a',
    unitAmount: 1600,
    currency: 'eur',
    interval: 'month',
    tier: 2,
    tierName: 'core',
  },
  {
    id: 'price_2b',
    unitAmount: 2500,
    currency: 'eur',
    interval: 'month',
    tier: 2,
    tierName: 'core',
  },
  {
    id: 'price_3a',
    unitAmount: 3200,
    currency: 'eur',
    interval: 'month',
    tier: 3,
    tierName: 'impact',
  },
  {
    id: 'price_3b',
    unitAmount: 6000,
    currency: 'eur',
    interval: 'month',
    tier: 3,
    tierName: 'impact',
  },
  {
    id: 'price_1a_year',
    unitAmount: 8000,
    currency: 'eur',
    interval: 'year',
    tier: 1,
    tierName: 'starter',
  },
  {
    id: 'price_1b_year',
    unitAmount: 15000,
    currency: 'eur',
    interval: 'year',
    tier: 1,
    tierName: 'starter',
  },
  {
    id: 'price_2a_year',
    unitAmount: 16000,
    currency: 'eur',
    interval: 'year',
    tier: 2,
    tierName: 'core',
  },
  {
    id: 'price_2b_year',
    unitAmount: 25000,
    currency: 'eur',
    interval: 'year',
    tier: 2,
    tierName: 'core',
  },
  {
    id: 'price_3a_year',
    unitAmount: 32000,
    currency: 'eur',
    interval: 'year',
    tier: 3,
    tierName: 'impact',
  },
  {
    id: 'price_3b_year',
    unitAmount: 60000,
    currency: 'eur',
    interval: 'year',
    tier: 3,
    tierName: 'impact',
  },
];

const mockTierConfig = {
  1: { color: 'green', name: 'Starter', description: 'You help us develop new features, get videos in 4K without ads!' },
  2: { color: 'blue', name: 'Hero', description: 'You help us develop new features, get videos in 4K without ads!' },
  3: { color: '#F5C207', name: 'Legend', description: 'You help us develop new features, get videos in 4K without ads!' },
};

const mockTenantSettings = {
  siteName: 'Test Community',
  siteNameShort: 'Test',
  siteImage: '/test-logo.png',
  siteDescription: '',
  siteUrl: '',
  messageSignOff: '',
  id: 'test',
  beta: false,
  authProvider: 'firebase' as const,
  academyResource: '',
  discordInvite: '',
  donationBody: '',
  socialMediaCustomLabel: '',
  patreonUrl: '',
  questions: {} as any,
  modules: {} as any,
  roles: {} as any,
  environment: {},
} as any;

const renderPage = (
  initialUrl: string,
  overrides: { isAuthenticated?: boolean; userEmail?: string } = {},
) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        path="/support"
        element={
          <TenantContext.Provider value={mockTenantSettings}>
            <SupporterPage
              prices={mockPrices}
              tierConfig={mockTierConfig}
              isAuthenticated={overrides.isAuthenticated ?? false}
              userEmail={overrides.userEmail ?? ''}
            />
          </TenantContext.Provider>
        }
      />,
    ),
    { initialEntries: [initialUrl] },
  );

  const result = render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );

  return { ...result, router };
};

const getStepParam = (router: ReturnType<typeof createMemoryRouter>) =>
  new URLSearchParams(router.state.location.search).get('step');

const getPreviewParam = (router: ReturnType<typeof createMemoryRouter>) =>
  new URLSearchParams(router.state.location.search).get('preview');

describe('SupporterPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('step param tracking', () => {
    it('sets ?step=form on initial page load', async () => {
      const { router } = renderPage('/support');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Test Membership')).toBeInTheDocument();
    });

    it('resets ?step=checkout to ?step=form on direct visit', async () => {
      const { router } = renderPage('/support?step=checkout');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Test Membership')).toBeInTheDocument();
    });

    it('resets ?step=thank-you to ?step=form on direct visit', async () => {
      const { router } = renderPage('/support?step=thank-you');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Test Membership')).toBeInTheDocument();
    });
  });

  describe('preview mode uses ?preview= param', () => {
    it('renders login form for ?preview=login and does not set step', async () => {
      const { router } = renderPage('/support?preview=login');

      await waitFor(() => {
        expect(screen.getByText('Login to your account')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('login');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders account form for ?preview=create and does not set step', async () => {
      const { router } = renderPage('/support?preview=create');

      await waitFor(() => {
        expect(screen.getByText('Setup your account')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('create');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders authenticated view for ?preview=authenticated and does not set step', async () => {
      const { router } = renderPage('/support?preview=authenticated');

      await waitFor(() => {
        expect(
          screen.getByText('Continue'),
        ).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('authenticated');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders form for ?preview=form and does not set step', async () => {
      const { router } = renderPage('/support?preview=form');

      await waitFor(() => {
        expect(screen.getByText('Test Membership')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('form');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders checkout layout for ?preview=checkout and does not set step', async () => {
      const { router } = renderPage('/support?preview=checkout');

      await waitFor(() => {
        expect(screen.getByTestId('payment-element')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('checkout');
      expect(getStepParam(router)).toBeNull();
    });

    it('does not treat old ?step=login as preview mode', async () => {
      const { router } = renderPage('/support?step=login');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Test Membership')).toBeInTheDocument();
    });
  });

  describe('tier query param', () => {
    it('preselects lowest price for tier 1 with ?tier=1', async () => {
      renderPage('/support?tier=1');

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€8');
      });
    });

    it('preselects lowest price for tier 3 with ?tier=3', async () => {
      renderPage('/support?tier=3');

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€32');
      });
    });

    it('falls back to lowest price for default tier 2 with invalid ?tier=99', async () => {
      renderPage('/support?tier=99');

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€16');
      });
    });
  });

  describe('flow transitions', () => {
    it('updates to ?step=checkout after support submission', async () => {
      mockCreateElementsSubscription.mockResolvedValue({
        ok: true,
        clientSecret: 'cs_test_123',
        publishableKey: 'pk_test_123',
        stripeCustomerId: 'cus_123',
        accountExists: false,
      });

      const { router } = renderPage('/support', {
        isAuthenticated: true,
        userEmail: 'test@test.com',
      });

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      const supportButton = screen.getByRole('button', { name: /Support/ });
      await userEvent.click(supportButton);

      await waitFor(() => {
        expect(getStepParam(router)).toBe('checkout');
      });

      expect(screen.getByTestId('payment-element')).toBeInTheDocument();
    });

    it('resets to ?step=form when clicking back from checkout', async () => {
      mockCreateElementsSubscription.mockResolvedValue({
        ok: true,
        clientSecret: 'cs_test_123',
        publishableKey: 'pk_test_123',
        stripeCustomerId: 'cus_123',
        accountExists: false,
      });

      const { router } = renderPage('/support', {
        isAuthenticated: true,
        userEmail: 'test@test.com',
      });

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      await userEvent.click(screen.getByRole('button', { name: /Support/ }));

      await waitFor(() => {
        expect(getStepParam(router)).toBe('checkout');
      });

      await userEvent.click(screen.getByText('← Back'));

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Test Membership')).toBeInTheDocument();
    });

    it('updates to ?step=thank-you after payment success (authenticated)', async () => {
      mockCreateElementsSubscription.mockResolvedValue({
        ok: true,
        clientSecret: 'cs_test_123',
        publishableKey: 'pk_test_123',
        stripeCustomerId: 'cus_123',
        accountExists: false,
      });

      const { router } = renderPage('/support', {
        isAuthenticated: true,
        userEmail: 'test@test.com',
      });

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      await userEvent.click(screen.getByRole('button', { name: /Support/ }));

      await waitFor(() => {
        expect(getStepParam(router)).toBe('checkout');
      });

      const payButton = screen.getByRole('button', { name: /Pay/ });
      await userEvent.click(payButton);

      await waitFor(() => {
        expect(getStepParam(router)).toBe('thank-you');
      });
    });
  });

  describe('interval switching preserves selection index', () => {
    it('keeps the same position when switching from monthly to yearly', async () => {
      renderPage('/support');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Support/ })).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: '€8' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€8/month');
      });

      await userEvent.click(screen.getByRole('button', { name: 'Yearly' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€80/year');
      });
    });

    it('submits the yearly price ID after switching intervals', async () => {
      mockCreateElementsSubscription.mockResolvedValue({
        ok: true,
        clientSecret: 'cs_test_123',
        publishableKey: 'pk_test_123',
        stripeCustomerId: 'cus_123',
        accountExists: false,
      });

      renderPage('/support', { isAuthenticated: true, userEmail: 'test@test.com' });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Support/ })).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: '€8' }));
      await userEvent.click(screen.getByRole('button', { name: 'Yearly' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€80/year');
      });

      await userEvent.click(screen.getByRole('button', { name: /Support/ }));

      await waitFor(() => {
        expect(mockCreateElementsSubscription).toHaveBeenCalledWith(
          expect.objectContaining({ priceId: 'price_1a_year' }),
        );
      });
    });

    it('keeps the same position when switching from yearly back to monthly', async () => {
      renderPage('/support');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Support/ })).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: '€60' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€60/month');
      });

      await userEvent.click(screen.getByRole('button', { name: 'Yearly' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€600/year');
      });

      await userEvent.click(screen.getByRole('button', { name: 'Monthly' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Support/ }),
        ).toHaveTextContent('€60/month');
      });
    });
  });

  describe('Stripe redirect', () => {
    it('sets ?step=thank-you after payment=success redirect', async () => {
      mockCreateSupporterAccount.mockResolvedValue({ ok: true });

      const { router } = renderPage(
        '/support?payment=success&customer=cus_123&email=test@test.com&name=Test',
      );

      await waitFor(() => {
        expect(getStepParam(router)).toBe('thank-you');
      });
    });
  });
});
