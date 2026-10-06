import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockOpen, mockGet } = vi.hoisted(() => ({
  mockOpen: vi.fn(),
  mockGet: vi.fn(),
}));

vi.mock('maxmind', () => ({
  default: {
    open: mockOpen,
    validate: (ip: string) => /^[\d.:a-f]+$/i.test(ip),
  },
}));

const requestFrom = (ip?: string) =>
  new Request('http://localhost/support', {
    headers: ip ? { 'fly-client-ip': ip } : {},
  });

const loadService = async () => {
  vi.resetModules();
  return import('./geoBlock.server');
};

describe('isBlockedRegion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOpen.mockResolvedValue({ get: mockGet });
  });

  it('blocks a sanctioned country', async () => {
    mockGet.mockReturnValue({ country: { iso_code: 'IR' } });
    const { isBlockedRegion } = await loadService();

    expect(await isBlockedRegion(requestFrom('1.2.3.4'))).toBe(true);
  });

  it('blocks extra countries from GEO_BLOCK_EXTRA_COUNTRIES', async () => {
    vi.stubEnv('GEO_BLOCK_EXTRA_COUNTRIES', 'PT, ES');
    mockGet.mockReturnValue({ country: { iso_code: 'ES' } });
    const { isBlockedRegion } = await loadService();
    vi.unstubAllEnvs();

    expect(await isBlockedRegion(requestFrom('1.2.3.4'))).toBe(true);
  });

  it('blocks a sanctioned region', async () => {
    mockGet.mockReturnValue({ country: { iso_code: 'UA' }, subdivisions: [{ iso_code: '43' }] });
    const { isBlockedRegion } = await loadService();

    expect(await isBlockedRegion(requestFrom('1.2.3.4'))).toBe(true);
  });

  it('allows other regions of a partially sanctioned country', async () => {
    mockGet.mockReturnValue({ country: { iso_code: 'UA' }, subdivisions: [{ iso_code: '30' }] });
    const { isBlockedRegion } = await loadService();

    expect(await isBlockedRegion(requestFrom('1.2.3.4'))).toBe(false);
  });

  it('allows other countries', async () => {
    mockGet.mockReturnValue({ country: { iso_code: 'PT' } });
    const { isBlockedRegion } = await loadService();

    expect(await isBlockedRegion(requestFrom('1.2.3.4'))).toBe(false);
  });

  it('allows unknown IPs', async () => {
    mockGet.mockReturnValue(null);
    const { isBlockedRegion } = await loadService();

    expect(await isBlockedRegion(requestFrom('1.2.3.4'))).toBe(false);
  });

  it('allows requests without a valid IP header', async () => {
    const { isBlockedRegion } = await loadService();

    expect(await isBlockedRegion(requestFrom())).toBe(false);
    expect(await isBlockedRegion(requestFrom('not-an-ip!'))).toBe(false);
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('allows requests when the database is missing', async () => {
    mockOpen.mockRejectedValue(new Error('ENOENT'));
    const { isBlockedRegion } = await loadService();

    expect(await isBlockedRegion(requestFrom('1.2.3.4'))).toBe(false);
  });

  it('opens the database once', async () => {
    mockGet.mockReturnValue({ country: { iso_code: 'PT' } });
    const { isBlockedRegion } = await loadService();

    await isBlockedRegion(requestFrom('1.2.3.4'));
    await isBlockedRegion(requestFrom('5.6.7.8'));

    expect(mockOpen).toHaveBeenCalledTimes(1);
  });
});
