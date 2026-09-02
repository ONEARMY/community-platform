import { bannerCache, BannerServiceServer } from 'src/services/bannerService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const single = vi.fn();
const query: any = {
  insert: vi.fn(() => query),
  update: vi.fn(() => query),
  delete: vi.fn(() => query),
  eq: vi.fn(() => query),
  select: vi.fn(() => query),
  single,
};
const mockClient: any = { from: vi.fn(() => query) };

const dbBanner = {
  id: 3,
  created_at: '2026-01-01T00:00:00.000Z',
  modified_at: null,
  text: 'Hello',
  url: 'https://example.com',
};

describe('BannerServiceServer', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await bannerCache.set('banner', { text: 'stale' } as any);
  });

  it('creates a banner and clears the cache', async () => {
    single.mockResolvedValue({ data: dbBanner, error: null });

    const banner = await new BannerServiceServer(mockClient).create({
      text: 'Hello',
      url: 'https://example.com',
    });

    expect(mockClient.from).toHaveBeenCalledWith('banners');
    expect(query.insert).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Hello', url: 'https://example.com' }),
    );
    expect(banner.id).toBe(3);
    expect(banner.text).toBe('Hello');
    expect(await bannerCache.get('banner')).toBeUndefined();
  });

  it('updates a banner by id and clears the cache', async () => {
    single.mockResolvedValue({ data: { ...dbBanner, text: 'Updated' }, error: null });

    const banner = await new BannerServiceServer(mockClient).update(3, {
      text: 'Updated',
      url: null,
    });

    expect(query.update).toHaveBeenCalledWith({ text: 'Updated', url: null });
    expect(query.eq).toHaveBeenCalledWith('id', 3);
    expect(banner.text).toBe('Updated');
    expect(await bannerCache.get('banner')).toBeUndefined();
  });

  it('deletes a banner by id and clears the cache', async () => {
    query.eq.mockResolvedValueOnce({ error: null });

    await new BannerServiceServer(mockClient).delete(3);

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('id', 3);
    expect(await bannerCache.get('banner')).toBeUndefined();
  });

  it('throws and keeps the cache when the update fails', async () => {
    const error = new Error('boom');
    single.mockResolvedValue({ data: null, error });

    await expect(
      new BannerServiceServer(mockClient).update(3, { text: 'Updated', url: null }),
    ).rejects.toBe(error);
    expect(await bannerCache.get('banner')).toEqual({ text: 'stale' });
  });
});
