import { StripeAdminService, StripeServiceServer } from 'src/services/stripeService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.stripe.webhook';

vi.mock('src/repository/supabaseAdmin.server');
vi.mock('src/services/membershipNotifier.server');
vi.mock('src/services/secretsService.server');
vi.mock('src/services/stripeService.server');

const setup = (subscription: Record<string, unknown>) => {
  vi.mocked(StripeServiceServer.constructWebhookEvent).mockResolvedValue({
    type: 'customer.subscription.updated',
    data: {
      object: {
        id: 'sub_1',
        customer: 'cus_1',
        items: { data: [{ price: { product: 'prod_1' } }] },
        ...subscription,
      },
    },
    // biome-ignore lint/suspicious/noExplicitAny: event stub
  } as any);

  (StripeServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getAuthIdByStripeCustomerId: vi.fn().mockResolvedValue('user-1') };
  });

  const admin = {
    getBadgeIdForProduct: vi.fn().mockResolvedValue(42),
    assignBadgeForSubscription: vi.fn(),
    removeTierBadges: vi.fn(),
  };

  (StripeAdminService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return admin;
  });

  return admin;
};

const deliver = () =>
  action({
    request: new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 't=1,v1=signature' },
    }),
    params: {},
    context: {},
    // biome-ignore lint/suspicious/noExplicitAny: minimal args stub
  } as any) as Promise<Response>;

describe('membership badge webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('TENANT_ID', 'tenant-1');
  });

  it('removes the tier badge when a membership is paused', async () => {
    const admin = setup({ status: 'paused' });

    const res = await deliver();

    expect(res.status).toBe(200);
    expect(admin.removeTierBadges).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(admin.assignBadgeForSubscription).not.toHaveBeenCalled();
  });

  it('gives the tier badge back when a paused membership resumes', async () => {
    const admin = setup({ status: 'active' });

    const res = await deliver();

    expect(res.status).toBe(200);
    expect(admin.assignBadgeForSubscription).toHaveBeenCalledWith('user-1', 'tenant-1', 42);
    expect(admin.removeTierBadges).not.toHaveBeenCalled();
  });
});
