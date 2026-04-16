import type { Stripe as StripeType } from '@stripe/stripe-js';
import { createContext, useContext } from 'react';

export type Interval = 'month' | 'year';

export type SupporterState = {
  currency: string;
  setCurrency: (c: string) => void;
  interval: Interval;
  setInterval: (i: Interval) => void;
  amount: number;
  setAmount: (a: number) => void;
  name: string;
  setName: (n: string) => void;
  email: string;
  setEmail: (e: string) => void;

  currencies: { value: string; label: string }[];
  availableAmounts: number[];
  selectedAmount: number;
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

  onSupport: () => void;
  onPaymentSuccess: () => void;
  onBack: () => void;
};

const SupporterContext = createContext<SupporterState | null>(null);

export const SupporterProvider = SupporterContext.Provider;

export const useSupporterContext = () => {
  const ctx = useContext(SupporterContext);
  if (!ctx) throw new Error('useSupporterContext must be used within SupporterProvider');
  return ctx;
};
