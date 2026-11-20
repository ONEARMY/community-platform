import {
  ProfileBadgeServiceServer,
  profileBadgesCache,
} from 'src/services/profileBadgeService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const single = vi.fn();
const query: any = {
  select: vi.fn(() => query),
  insert: vi.fn(() => query),
  update: vi.fn(() => query),
  delete: vi.fn(() => query),
  in: vi.fn(() => query),
  eq: vi.fn(() => query),
  order: vi.fn(),
  single,
};
const mockClient: any = { from: vi.fn(() => query) };

const dbBadge = {
  id: 7,
  name: 'member',
  display_name: 'Member',
  image_url: 'https://example.com/member.svg',
  action_url: '/support',
  premium_tier: null,
  is_audience: true,
  grants_badge_id: null,
  available_to: 'non_space',
  action_label: 'Become a member',
};

const input = {
  name: 'member',
  displayName: 'Member',
  imageUrl: 'https://example.com/member.svg',
  actionUrl: '/support',
  isAudience: true,
  grantsBadgeId: null,
  availableTo: 'non_space' as const,
  actionLabel: 'Become a member',
};

describe('ProfileBadgeServiceServer', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await profileBadgesCache.set('profileBadges', [{ id: 1 }] as any);
  });

  describe('areAudience', () => {
    it('accepts an empty list without querying', async () => {
      expect(await new ProfileBadgeServiceServer(mockClient).areAudience([])).toBe(true);
      expect(mockClient.from).not.toHaveBeenCalled();
    });

    it('accepts when every badge is an audience badge', async () => {
      query.eq.mockResolvedValueOnce({ count: 2, error: null });

      expect(await new ProfileBadgeServiceServer(mockClient).areAudience([1, 2])).toBe(true);
      expect(query.in).toHaveBeenCalledWith('id', [1, 2]);
      expect(query.eq).toHaveBeenCalledWith('is_audience', true);
    });

    it('rejects when a badge is not an audience badge or does not exist', async () => {
      query.eq.mockResolvedValueOnce({ count: 1, error: null });

      expect(await new ProfileBadgeServiceServer(mockClient).areAudience([1, 2])).toBe(false);
    });

    it('ignores duplicate ids', async () => {
      query.eq.mockResolvedValueOnce({ count: 1, error: null });

      expect(await new ProfileBadgeServiceServer(mockClient).areAudience([4, 4])).toBe(true);
      expect(query.in).toHaveBeenCalledWith('id', [4]);
    });

    it('throws when the query fails', async () => {
      const error = new Error('boom');
      query.eq.mockResolvedValueOnce({ count: null, error });

      await expect(new ProfileBadgeServiceServer(mockClient).areAudience([1])).rejects.toBe(
        error,
      );
    });
  });

  it('maps usage counts', async () => {
    query.order.mockResolvedValueOnce({
      data: [
        {
          ...dbBadge,
          holders: [{ count: 3 }],
          articles: [{ count: 2 }],
          stripe_products: [{ count: 0 }],
          stripe_tiers: [{ count: 1 }],
        },
      ],
      error: null,
    });

    const [result] = await new ProfileBadgeServiceServer(mockClient).getAllWithUsage();

    expect(result.badge.availableTo).toBe('non_space');
    expect(result.usage).toEqual({ holders: 3, articles: 2, stripeLinked: true });
  });

  it('creates a badge and clears the cache', async () => {
    single.mockResolvedValueOnce({ data: dbBadge, error: null });

    const badge = await new ProfileBadgeServiceServer(mockClient).create(input);

    expect(query.insert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'member', is_audience: true, available_to: 'non_space' }),
    );
    expect(badge.displayName).toBe('Member');
    expect(await profileBadgesCache.get('profileBadges')).toBeUndefined();
  });

  it('updates a badge without changing its name and clears the cache', async () => {
    single.mockResolvedValueOnce({ data: dbBadge, error: null });

    await new ProfileBadgeServiceServer(mockClient).update(7, { ...input, name: 'renamed' });

    expect(query.update).toHaveBeenCalledWith(expect.not.objectContaining({ name: 'renamed' }));
    expect(query.update.mock.calls[0][0]).not.toHaveProperty('name');
    expect(query.eq).toHaveBeenCalledWith('id', 7);
    expect(await profileBadgesCache.get('profileBadges')).toBeUndefined();
  });

  it('deletes a badge and clears the cache', async () => {
    query.eq.mockResolvedValueOnce({ error: null });

    await new ProfileBadgeServiceServer(mockClient).delete(7);

    expect(query.delete).toHaveBeenCalled();
    expect(await profileBadgesCache.get('profileBadges')).toBeUndefined();
  });

  it('keeps the cache when an update fails', async () => {
    const error = new Error('boom');
    single.mockResolvedValueOnce({ data: null, error });

    await expect(new ProfileBadgeServiceServer(mockClient).update(7, input)).rejects.toBe(error);
    expect(await profileBadgesCache.get('profileBadges')).toEqual([{ id: 1 }]);
  });
});
