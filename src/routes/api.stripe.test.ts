import { FRIENDLY_MESSAGES } from 'oa-shared';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { StripeServiceServer } from 'src/services/stripeService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action, loader } from './api.stripe';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/stripeService.server');
vi.mock('src/services/geoBlock.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/secretsService.server');

const active = { id: 'sub_1', status: 'active', cancel_at: null };
const paused = { id: 'sub_1', status: 'paused', cancel_at: null };

const setup = (opts: {
  authed?: boolean;
  customerId?: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: subscription stub
  subscription?: any;
  // biome-ignore lint/suspicious/noExplicitAny: resume result stub
  resumeResult?: any;
}) => {
  const getClaims = vi
    .fn()
    .mockResolvedValue(
      opts.authed === false ? { data: null } : { data: { claims: { sub: 'user-1' } } },
    );

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims } },
    headers: new Headers(),
  });

  const getCustomerByAuthId = vi
    .fn()
    .mockResolvedValue(opts.customerId === undefined ? 'cus_1' : opts.customerId);

  (StripeServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getCustomerByAuthId };
  });

  vi.mocked(StripeServiceServer.getSubscription).mockResolvedValue(opts.subscription ?? null);
  vi.mocked(StripeServiceServer.resumeSubscription).mockResolvedValue(
    opts.resumeResult ?? { resumed: true },
  );

  return { getCustomerByAuthId };
};

const post = (actionType: 'pause' | 'resume') =>
  action({
    request: new Request('http://localhost/api/stripe', {
      method: 'POST',
      body: JSON.stringify({ action: actionType }),
      headers: { 'Content-Type': 'application/json' },
    }),
    params: {},
    context: {},
    // biome-ignore lint/suspicious/noExplicitAny: minimal args stub
  } as any) as Promise<Response>;

describe('pausing and resuming a membership', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('TENANT_ID', 'tenant-1');
  });

  it('pauses an active membership', async () => {
    const { getCustomerByAuthId } = setup({ subscription: active });

    const res = await post('pause');

    expect(res.status).toBe(200);
    expect(getCustomerByAuthId).toHaveBeenCalledWith('user-1');
    expect(StripeServiceServer.pauseSubscription).toHaveBeenCalledWith('sub_1');
  });

  it('will not pause a membership that is set to cancel', async () => {
    setup({ subscription: { ...active, cancel_at: 1893456000 } });

    const res = await post('pause');

    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: FRIENDLY_MESSAGES['supporter/not-pausable'] });
    expect(StripeServiceServer.pauseSubscription).not.toHaveBeenCalled();
  });

  it('will not pause a membership that is already paused', async () => {
    setup({ subscription: paused });

    const res = await post('pause');

    expect(res.status).toBe(409);
    expect(StripeServiceServer.pauseSubscription).not.toHaveBeenCalled();
  });

  it('resumes a paused membership', async () => {
    setup({ subscription: paused });

    const res = await post('resume');

    expect(res.status).toBe(200);
    expect(StripeServiceServer.resumeSubscription).toHaveBeenCalledWith('sub_1');
  });

  it('links to the payment page when the resume payment is not complete', async () => {
    setup({
      subscription: paused,
      resumeResult: { resumed: false, paymentUrl: 'https://invoice.stripe.com/i/1' },
    });

    const res = await post('resume');

    expect(res.status).toBe(402);
    expect(await res.json()).toEqual({
      error: FRIENDLY_MESSAGES['supporter/resume-payment-incomplete'],
      paymentUrl: 'https://invoice.stripe.com/i/1',
    });
  });

  it('asks for a payment method when there is nothing to charge', async () => {
    setup({ subscription: paused, resumeResult: { resumed: false, paymentUrl: null } });

    const res = await post('resume');

    expect(res.status).toBe(402);
    expect((await res.json()).error).toBe(FRIENDLY_MESSAGES['supporter/resume-no-payment-method']);
  });

  it('does not pass a raw Stripe error on to the member', async () => {
    setup({ subscription: active });
    vi.mocked(StripeServiceServer.pauseSubscription).mockRejectedValue(
      new Error('This subscription uses classic billing mode'),
    );

    const res = await post('pause');

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: FRIENDLY_MESSAGES['supporter/membership-change-failed'],
    });
  });

  it('will not resume a membership that is not paused', async () => {
    setup({ subscription: active });

    const res = await post('resume');

    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: FRIENDLY_MESSAGES['supporter/not-paused'] });
    expect(StripeServiceServer.resumeSubscription).not.toHaveBeenCalled();
  });

  it('reports a missing membership for a user who never subscribed', async () => {
    setup({ customerId: null });

    const res = await post('pause');

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: FRIENDLY_MESSAGES['supporter/no-membership'] });
    expect(StripeServiceServer.getSubscription).not.toHaveBeenCalled();
  });

  it('rejects a signed-out request', async () => {
    setup({ authed: false });

    const res = await post('pause');

    expect(res.status).toBe(401);
    expect(StripeServiceServer.pauseSubscription).not.toHaveBeenCalled();
  });
});

describe('membership status', () => {
  beforeEach(() => vi.clearAllMocks());

  const get = () =>
    loader({
      request: new Request('http://localhost/api/stripe'),
      params: {},
      context: {},
      // biome-ignore lint/suspicious/noExplicitAny: minimal args stub
    } as any) as Promise<Response>;

  it('reports a paused membership and when it was paused', async () => {
    setup({
      subscription: {
        ...paused,
        cancel_at_period_end: false,
        status_details: { paused: { transitioned_at: 1790856000 } },
      },
    });

    const res = await get();

    expect(await res.json()).toEqual({
      hasSubscription: true,
      subscription: {
        status: 'paused',
        cancelAtPeriodEnd: false,
        cancelAt: null,
        pausedAt: 1790856000,
      },
    });
  });
});
