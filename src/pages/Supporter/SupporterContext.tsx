import type { Stripe as StripeType } from '@stripe/stripe-js';
import { createContext, useContext } from 'react';

export type Interval = 'month' | 'year';

export type SupporterState = {
  currency: string;
  setCurrency: (c: string) => void;
  interval: Interval;
  setInterval: (i: Interval) => void;
  selectedPriceId: string | null;
  setSelectedPriceId: (id: string) => void;
  name: string;
  setName: (n: string) => void;
  email: string;
  setEmail: (e: string) => void;

  currencies: { value: string; label: string }[];
  availablePrices: {
    id: string;
    unitAmount: number;
    tier: number | null;
    tierName: string | null;
  }[];
  selectedAmount: number;
  selectedTier: number | null;
  selectedTierName: string | null;
  symbol: string;

  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accountExists: boolean;
  accountCreated: boolean;

  clientSecret: string | null;
  stripeInstance: Promise<StripeType | null> | null;
  stripeCustomerId: string | null;

  siteImage: string | undefined;
  tierConfig: Record<number, { color: string; name: string; description: string }>;
  siteName: string | undefined;
  thankYouImageUrl: string | null;
  previewMode: boolean;

  onSupport: () => void;
  onPaymentSuccess: () => void;
  onBack: () => void;
};

const SupporterContext = createContext<SupporterState | null>(null);

export const SupporterProvider = SupporterContext.Provider;

export const useSupporterContext = () => {
  const ctx = useContext(SupporterContext);
  if (!ctx) {
    throw new Error('useSupporterContext must be used within SupporterProvider');
  }
  return ctx;
};
