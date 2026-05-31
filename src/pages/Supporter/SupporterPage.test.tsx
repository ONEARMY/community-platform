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
    id: 'price_1',
    unitAmount: 800,
    currency: 'eur',
    interval: 'month',
    tier: 1,
    tierName: 'starter',
  },
  {
    id: 'price_2',
    unitAmount: 1600,
    currency: 'eur',
    interval: 'month',
    tier: 2,
    tierName: 'core',
  },
  {
    id: 'price_3',
    unitAmount: 3200,
    currency: 'eur',
    interval: 'month',
    tier: 3,
    tierName: 'impact',
  },
];

const renderPage = (
  initialUrl: string,
  overrides: { isAuthenticated?: boolean; userEmail?: string } = {},
) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route
        path="/supporter"
        element={
          <SupporterPage
            prices={mockPrices}
            isAuthenticated={overrides.isAuthenticated ?? false}
            userEmail={overrides.userEmail ?? ''}
          />
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

describe('SupporterPage query params', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('step param tracking', () => {
    it('sets ?step=form on initial page load', async () => {
      const { router } = renderPage('/supporter');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Become a supporter')).toBeInTheDocument();
    });

    it('resets ?step=checkout to ?step=form on direct visit', async () => {
      const { router } = renderPage('/supporter?step=checkout');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Become a supporter')).toBeInTheDocument();
    });

    it('resets ?step=thank-you to ?step=form on direct visit', async () => {
      const { router } = renderPage('/supporter?step=thank-you');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Become a supporter')).toBeInTheDocument();
    });
  });

  describe('preview mode uses ?preview= param', () => {
    it('renders login form for ?preview=login and does not set step', async () => {
      const { router } = renderPage('/supporter?preview=login');

      await waitFor(() => {
        expect(screen.getByText('Login to your account')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('login');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders account form for ?preview=create and does not set step', async () => {
      const { router } = renderPage('/supporter?preview=create');

      await waitFor(() => {
        expect(screen.getByText('Setup your account')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('create');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders authenticated view for ?preview=authenticated and does not set step', async () => {
      const { router } = renderPage('/supporter?preview=authenticated');

      await waitFor(() => {
        expect(
          screen.getByText('Check what we prepared for you'),
        ).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('authenticated');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders form for ?preview=form and does not set step', async () => {
      const { router } = renderPage('/supporter?preview=form');

      await waitFor(() => {
        expect(screen.getByText('Become a supporter')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('form');
      expect(getStepParam(router)).toBeNull();
    });

    it('renders checkout layout for ?preview=checkout and does not set step', async () => {
      const { router } = renderPage('/supporter?preview=checkout');

      await waitFor(() => {
        expect(screen.getByText('Payment checkout')).toBeInTheDocument();
      });

      expect(getPreviewParam(router)).toBe('checkout');
      expect(getStepParam(router)).toBeNull();
    });

    it('does not treat old ?step=login as preview mode', async () => {
      const { router } = renderPage('/supporter?step=login');

      await waitFor(() => {
        expect(getStepParam(router)).toBe('form');
      });

      expect(screen.getByText('Become a supporter')).toBeInTheDocument();
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

      const { router } = renderPage('/supporter', {
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

      expect(screen.getByText('Payment checkout')).toBeInTheDocument();
    });

    it('resets to ?step=form when clicking back from checkout', async () => {
      mockCreateElementsSubscription.mockResolvedValue({
        ok: true,
        clientSecret: 'cs_test_123',
        publishableKey: 'pk_test_123',
        stripeCustomerId: 'cus_123',
        accountExists: false,
      });

      const { router } = renderPage('/supporter', {
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

      expect(screen.getByText('Become a supporter')).toBeInTheDocument();
    });

    it('updates to ?step=thank-you after payment success (authenticated)', async () => {
      mockCreateElementsSubscription.mockResolvedValue({
        ok: true,
        clientSecret: 'cs_test_123',
        publishableKey: 'pk_test_123',
        stripeCustomerId: 'cus_123',
        accountExists: false,
      });

      const { router } = renderPage('/supporter', {
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

  describe('Stripe redirect', () => {
    it('sets ?step=thank-you after payment=success redirect', async () => {
      mockCreateSupporterAccount.mockResolvedValue({ ok: true });

      const { router } = renderPage(
        '/supporter?payment=success&customer=cus_123&email=test@test.com&name=Test',
      );

      await waitFor(() => {
        expect(getStepParam(router)).toBe('thank-you');
      });
    });
  });
});
