import { beforeEach, describe, expect, it, vi } from 'vitest';
import { subscribersService } from 'src/services/subscribersService';
import { SubscriptionStore } from './subscription.store';

vi.mock('src/services/subscribersService');
vi.mock('src/common/Analytics', () => ({
  trackEvent: vi.fn(),
}));

describe('SubscriptionStore', () => {
  let store: SubscriptionStore;

  beforeEach(() => {
    store = new SubscriptionStore();
    vi.clearAllMocks();
  });

  describe('checkAndCacheSubscription', () => {
    it('should fetch and cache subscription status', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValue(true);

      const result = await store.checkAndCacheSubscription('comments', 123);

      expect(result).toBe(true);
      expect(store.isSubscribed('comments', 123)).toBe(true);
      expect(subscribersService.isSubscribed).toHaveBeenCalledWith('comments', 123);
      expect(subscribersService.isSubscribed).toHaveBeenCalledTimes(1);
    });

    it('should return cached value on subsequent calls', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValue(true);

      const result1 = await store.checkAndCacheSubscription('comments', 123);
      const result2 = await store.checkAndCacheSubscription('comments', 123);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(subscribersService.isSubscribed).toHaveBeenCalledTimes(1);
    });

    it('should prevent duplicate API calls when called simultaneously', async () => {
      vi.mocked(subscribersService.isSubscribed).mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(true), 100)));

      const [result1, result2] = await Promise.all([
        store.checkAndCacheSubscription('comments', 123),
        store.checkAndCacheSubscription('comments', 123),
      ]);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(subscribersService.isSubscribed).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(subscribersService.isSubscribed).mockRejectedValue(new Error('API Error'));

      const result = await store.checkAndCacheSubscription('comments', 123);

      expect(result).toBe(false);
      expect(store.isSubscribed('comments', 123)).toBe(false);
    });

    it('should cache different content types separately', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      const result1 = await store.checkAndCacheSubscription('comments', 123);
      const result2 = await store.checkAndCacheSubscription('research', 123);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(store.isSubscribed('comments', 123)).toBe(true);
      expect(store.isSubscribed('research', 123)).toBe(false);
    });
  });

  describe('getSubscriptionState', () => {
    it('should return undefined for uncached items', () => {
      const state = store.isSubscribed('comments', 123);
      expect(state).toBeUndefined();
    });

    it('should return cached subscription state', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValue(true);

      await store.checkAndCacheSubscription('comments', 123);
      const state = store.isSubscribed('comments', 123);

      expect(state).toBe(true);
    });
  });

  describe('isLoading', () => {
    it('should return false for uncached items', () => {
      const loading = store.isLoading('comments', 123);
      expect(loading).toBe(false);
    });

    it('should return true while fetching', async () => {
      vi.mocked(subscribersService.isSubscribed).mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(true), 100)));

      const promise = store.checkAndCacheSubscription('comments', 123);
      expect(store.isLoading('comments', 123)).toBe(true);

      await promise;
      expect(store.isLoading('comments', 123)).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should subscribe and update cache optimistically', async () => {
      vi.mocked(subscribersService.add).mockResolvedValue({ ok: true } as Response);

      const success = await store.subscribe('comments', 123);

      expect(success).toBe(true);
      expect(store.isSubscribed('comments', 123)).toBe(true);
      expect(subscribersService.add).toHaveBeenCalledWith('comments', 123);
    });

    it('should rollback on failed subscribe', async () => {
      vi.mocked(subscribersService.add).mockResolvedValue({ ok: false } as Response);

      const success = await store.subscribe('comments', 123);

      expect(success).toBe(false);
      expect(store.isSubscribed('comments', 123)).toBe(false);
    });

    it('should handle API errors and rollback', async () => {
      vi.mocked(subscribersService.add).mockRejectedValue(new Error('Network error'));

      const success = await store.subscribe('comments', 123);

      expect(success).toBe(false);
      expect(store.isSubscribed('comments', 123)).toBe(false);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe and update cache optimistically', async () => {
      vi.mocked(subscribersService.remove).mockResolvedValue({ ok: true } as Response);

      // Set initial state as subscribed
      await store.subscribe('comments', 123);
      vi.mocked(subscribersService.add).mockResolvedValue({ ok: true } as Response);

      const success = await store.unsubscribe('comments', 123);

      expect(success).toBe(true);
      expect(store.isSubscribed('comments', 123)).toBe(false);
      expect(subscribersService.remove).toHaveBeenCalledWith('comments', 123);
    });

    it('should rollback on failed unsubscribe', async () => {
      vi.mocked(subscribersService.remove).mockResolvedValue({ ok: false } as Response);

      const success = await store.unsubscribe('comments', 123);

      expect(success).toBe(false);
      expect(store.isSubscribed('comments', 123)).toBe(true);
    });

    it('should handle API errors and rollback', async () => {
      vi.mocked(subscribersService.remove).mockRejectedValue(new Error('Network error'));

      const success = await store.unsubscribe('comments', 123);

      expect(success).toBe(false);
      expect(store.isSubscribed('comments', 123)).toBe(true);
    });
  });

  describe('toggleSubscription', () => {
    it('should subscribe when not currently subscribed', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValue(false);
      vi.mocked(subscribersService.add).mockResolvedValue({ ok: true } as Response);

      await store.toggleSubscription('comments', 123);

      expect(store.isSubscribed('comments', 123)).toBe(true);
    });

    it('should unsubscribe when currently subscribed', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValue(true);
      vi.mocked(subscribersService.remove).mockResolvedValue({ ok: true } as Response);

      await store.toggleSubscription('comments', 123);

      expect(store.isSubscribed('comments', 123)).toBe(false);
    });

    it('should toggle cached subscription state', async () => {
      vi.mocked(subscribersService.add).mockResolvedValue({ ok: true } as Response);
      vi.mocked(subscribersService.remove).mockResolvedValue({ ok: true } as Response);

      // Subscribe first
      await store.subscribe('comments', 123);
      expect(store.isSubscribed('comments', 123)).toBe(true);

      // Toggle should unsubscribe
      await store.toggleSubscription('comments', 123);
      expect(store.isSubscribed('comments', 123)).toBe(false);

      // Toggle again should subscribe
      await store.toggleSubscription('comments', 123);
      expect(store.isSubscribed('comments', 123)).toBe(true);
    });
  });

  describe('clearCache', () => {
    it('should clear all cached subscriptions', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValue(true);

      await store.checkAndCacheSubscription('comments', 123);
      await store.checkAndCacheSubscription('research', 456);

      expect(store.isSubscribed('comments', 123)).toBe(true);
      expect(store.isSubscribed('research', 456)).toBe(true);

      store.clearCache();

      expect(store.isSubscribed('comments', 123)).toBeUndefined();
      expect(store.isSubscribed('research', 456)).toBeUndefined();
    });
  });

  describe('preloadSubscriptions', () => {
    it('should fetch multiple subscriptions in parallel', async () => {
      vi.mocked(subscribersService.isSubscribed).mockResolvedValueOnce(true).mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      await store.preloadSubscriptions([
        { contentType: 'comments', itemId: 123 },
        { contentType: 'research', itemId: 456 },
        { contentType: 'news', itemId: 789 },
      ]);

      expect(store.isSubscribed('comments', 123)).toBe(true);
      expect(store.isSubscribed('research', 456)).toBe(false);
      expect(store.isSubscribed('news', 789)).toBe(true);
      expect(subscribersService.isSubscribed).toHaveBeenCalledTimes(3);
    });
  });
});
