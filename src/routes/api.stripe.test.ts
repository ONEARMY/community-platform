import { FRIENDLY_MESSAGES } from 'oa-shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const stripe = vi.hoisted(() => ({
  getClaims: vi.fn(),
  getCustomerByAuthId: vi.fn(),
  getSubscription: vi.fn(),
  pauseSubscription: vi.fn(),
  resumeSubscription: vi.fn(),
}));

vi.mock('src/repository/supabase.server', () => ({
  createSupabaseServerClient: () => ({
    client: { auth: { getClaims: stripe.getClaims } },
    headers: new Headers(),
  }),
}));

vi.mock('src/services/stripeService.server', () => ({
  StripeServiceServer: class {
    getCustomerByAuthId = stripe.getCustomerByAuthId;
    static getSubscription = stripe.getSubscription;
    static pauseSubscription = stripe.pauseSubscription;
    static resumeSubscription = stripe.resumeSubscription;
  },
}));

vi.mock('src/services/geoBlock.server', () => ({ isBlockedRegion: vi.fn() }));
vi.mock('src/services/profileService.server', () => ({ ProfileServiceServer: vi.fn() }));
vi.mock('src/services/secretsService.server', () => ({ getSecret: vi.fn() }));
vi.mock('src/logger', () => ({ logger: { error: vi.fn() } }));

import { action } from './api.stripe';

const post = (actionType: 'pause' | 'resume') =>
  action({
    request: new Request('http://localhost/api/stripe', {
      method: 'POST',
      body: JSON.stringify({ action: actionType }),
      headers: { 'Content-Type': 'application/json' },
    }),
    params: {},
    context: {},
  } as any) as Promise<Response>;

const withSubscription = (subscription: Record<string, unknown> | null) => {
  stripe.getCustomerByAuthId.mockResolvedValue('cus_1');
  stripe.getSubscription.mockResolvedValue(subscription);
};

const active = { id: 'sub_1', status: 'active', cancel_at: null };
const paused = { id: 'sub_1', status: 'paused', cancel_at: null };

describe('pausing and resuming a membership', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('TENANT_ID', 'tenant-1');
    stripe.getClaims.mockResolvedValue({ data: { claims: { sub: 'user-1' } } });
  });

  it('pauses an active membership', async () => {
    withSubscription(active);

    const res = await post('pause');

    expect(res.status).toBe(200);
    expect(stripe.getCustomerByAuthId).toHaveBeenCalledWith('user-1');
    expect(stripe.pauseSubscription).toHaveBeenCalledWith('sub_1');
  });

  it('will not pause a membership that is set to cancel', async () => {
    withSubscription({ ...active, cancel_at: 1893456000 });

    const res = await post('pause');

    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: FRIENDLY_MESSAGES['supporter/not-pausable'] });
    expect(stripe.pauseSubscription).not.toHaveBeenCalled();
  });

  it('will not pause a membership that is already paused', async () => {
    withSubscription(paused);

    const res = await post('pause');

    expect(res.status).toBe(409);
    expect(stripe.pauseSubscription).not.toHaveBeenCalled();
  });

  it('resumes a paused membership', async () => {
    withSubscription(paused);

    const res = await post('resume');

    expect(res.status).toBe(200);
    expect(stripe.resumeSubscription).toHaveBeenCalledWith('sub_1');
  });

  it('will not resume a membership that is not paused', async () => {
    withSubscription(active);

    const res = await post('resume');

    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: FRIENDLY_MESSAGES['supporter/not-paused'] });
    expect(stripe.resumeSubscription).not.toHaveBeenCalled();
  });

  it('reports a missing membership for a user who never subscribed', async () => {
    stripe.getCustomerByAuthId.mockResolvedValue(null);

    const res = await post('pause');

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: FRIENDLY_MESSAGES['supporter/no-membership'] });
    expect(stripe.getSubscription).not.toHaveBeenCalled();
  });

  it('rejects a signed-out request', async () => {
    stripe.getClaims.mockResolvedValue({ data: null });

    const res = await post('pause');

    expect(res.status).toBe(401);
    expect(stripe.pauseSubscription).not.toHaveBeenCalled();
  });
});
