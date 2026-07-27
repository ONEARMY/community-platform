import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockList, mockCancel, mockGetSecret } = vi.hoisted(() => ({
  mockList: vi.fn(),
  mockCancel: vi.fn(),
  mockGetSecret: vi.fn(),
}));

vi.mock('stripe', () => ({
  __esModule: true,
  default: class {
    subscriptions = { list: mockList, cancel: mockCancel };
  },
}));

vi.mock('src/services/secretsService.server', () => ({
  getSecret: mockGetSecret,
}));

vi.mock('src/repository/supabaseAdmin.server', () => ({
  createSupabaseAdminServerClient: vi.fn(),
}));

// getStripe() caches its Stripe instance at module scope, so re-import a fresh module
// per test to keep the "not configured" case from reusing a previously built client.
async function loadService() {
  vi.resetModules();
  return (await import('src/services/stripeService.server')).StripeServiceServer;
}

describe('cancelActiveSubscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSecret.mockResolvedValue('sk_test_123');
  });

  it('cancels every subscription returned for the customer and returns the count', async () => {
    mockList.mockResolvedValueOnce({ data: [{ id: 'sub_1' }, { id: 'sub_2' }] });
    mockCancel.mockResolvedValue({});

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockList).toHaveBeenCalledWith({ customer: 'cus_1', limit: 100 });
    expect(mockCancel).toHaveBeenCalledTimes(2);
    expect(mockCancel).toHaveBeenCalledWith('sub_1');
    expect(mockCancel).toHaveBeenCalledWith('sub_2');
    expect(cancelled).toBe(2);
  });

  it('continues past a failing cancel and counts only the successes', async () => {
    mockList.mockResolvedValueOnce({ data: [{ id: 'sub_1' }, { id: 'sub_2' }] });
    mockCancel
      .mockRejectedValueOnce(new Error('stripe boom'))
      .mockResolvedValueOnce({});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockCancel).toHaveBeenCalledTimes(2);
    expect(cancelled).toBe(1);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('returns 0 without listing when the customer has no subscriptions', async () => {
    mockList.mockResolvedValueOnce({ data: [] });

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockList).toHaveBeenCalledWith({ customer: 'cus_1', limit: 100 });
    expect(mockCancel).not.toHaveBeenCalled();
    expect(cancelled).toBe(0);
  });

  it('returns 0 and does nothing when Stripe is not configured', async () => {
    mockGetSecret.mockRejectedValue(new Error('no key'));

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockList).not.toHaveBeenCalled();
    expect(mockCancel).not.toHaveBeenCalled();
    expect(cancelled).toBe(0);
  });
});
