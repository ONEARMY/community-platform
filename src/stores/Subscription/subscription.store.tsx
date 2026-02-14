import { action, makeObservable, observable, runInAction } from 'mobx';
import type { SubscribableContentTypes } from 'oa-shared';
import { createContext, useContext, useEffect } from 'react';
import { trackEvent } from 'src/common/Analytics';
import { subscribersService } from 'src/services/subscribersService';
import { useProfileStore } from '../Profile/profile.store';

type SubscriptionKey = `${SubscribableContentTypes}-${number}`;

interface SubscriptionState {
  isSubscribed: boolean;
  isLoading: boolean;
}

export class SubscriptionStore {
  subscriptions: Map<SubscriptionKey, SubscriptionState> = new Map();

  constructor() {
    makeObservable(this, {
      subscriptions: observable,
      checkAndCacheSubscription: action,
      subscribe: action,
      unsubscribe: action,
      clearCache: action,
    });
  }

  private getCacheKey(contentType: SubscribableContentTypes, itemId: number): SubscriptionKey {
    return `${contentType}-${itemId}`;
  }

  isSubscribed(contentType: SubscribableContentTypes, itemId: number): boolean | undefined {
    const key = this.getCacheKey(contentType, itemId);
    const state = this.subscriptions.get(key);
    return state?.isSubscribed;
  }

  isLoading(contentType: SubscribableContentTypes, itemId: number): boolean {
    const key = this.getCacheKey(contentType, itemId);
    return this.subscriptions.get(key)?.isLoading ?? false;
  }

  async checkAndCacheSubscription(contentType: SubscribableContentTypes, itemId: number): Promise<boolean> {
    const key = this.getCacheKey(contentType, itemId);
    const existing = this.subscriptions.get(key);

    if (existing && !existing.isLoading) {
      return existing.isSubscribed;
    }

    if (existing?.isLoading) {
      // Poll until loading is complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const state = this.subscriptions.get(key);
          if (state && !state.isLoading) {
            clearInterval(checkInterval);
            resolve(state.isSubscribed);
          }
        }, 50);
      });
    }

    this.subscriptions.set(key, { isSubscribed: false, isLoading: true });

    try {
      const isSubscribed = await subscribersService.isSubscribed(contentType, itemId);

      runInAction(() => {
        this.subscriptions.set(key, { isSubscribed, isLoading: false });
      });

      return isSubscribed;
    } catch (error) {
      console.error('Failed to check subscription:', error);
      runInAction(() => {
        this.subscriptions.set(key, { isSubscribed: false, isLoading: false });
      });
      return false;
    }
  }

  async subscribe(contentType: SubscribableContentTypes, itemId: number): Promise<boolean> {
    const key = this.getCacheKey(contentType, itemId);

    // Optimistic update
    this.subscriptions.set(key, {
      isSubscribed: true,
      isLoading: true,
    });

    try {
      const response = await subscribersService.add(contentType, itemId);

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      runInAction(() => {
        this.subscriptions.set(key, { isSubscribed: true, isLoading: false });
      });

      trackEvent({
        category: contentType,
        action: 'subscribed',
        label: `${itemId}`,
      });

      return true;
    } catch (error) {
      console.error('Failed to subscribe:', error);

      // Rollback optimistic update
      runInAction(() => {
        this.subscriptions.set(key, {
          isSubscribed: false,
          isLoading: false,
        });
      });

      return false;
    }
  }

  async unsubscribe(contentType: SubscribableContentTypes, itemId: number): Promise<boolean> {
    const key = this.getCacheKey(contentType, itemId);

    // Optimistic update
    this.subscriptions.set(key, {
      isSubscribed: false,
      isLoading: true,
    });

    try {
      const response = await subscribersService.remove(contentType, itemId);

      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

      runInAction(() => {
        this.subscriptions.set(key, { isSubscribed: false, isLoading: false });
      });

      trackEvent({
        category: contentType,
        action: 'unsubscribed',
        label: `${itemId}`,
      });

      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);

      // Rollback optimistic update
      runInAction(() => {
        this.subscriptions.set(key, {
          isSubscribed: true,
          isLoading: false,
        });
      });

      return false;
    }
  }

  async toggleSubscription(contentType: SubscribableContentTypes, itemId: number): Promise<boolean> {
    const currentState = this.isSubscribed(contentType, itemId);

    if (currentState === undefined) {
      // Not loaded yet, check first
      const isSubscribed = await this.checkAndCacheSubscription(contentType, itemId);
      return isSubscribed ? this.unsubscribe(contentType, itemId) : this.subscribe(contentType, itemId);
    }

    return currentState ? this.unsubscribe(contentType, itemId) : this.subscribe(contentType, itemId);
  }

  clearCache() {
    this.subscriptions.clear();
  }

  // TODO: have an endpoint to fetch multiple subscriptions
  async preloadSubscriptions(items: Array<{ contentType: SubscribableContentTypes; itemId: number }>): Promise<void> {
    await Promise.all(items.map((item) => this.checkAndCacheSubscription(item.contentType, item.itemId)));
  }
}

// Singleton instance
const subscriptionStore = new SubscriptionStore();
const SubscriptionStoreContext = createContext<SubscriptionStore | null>(null);

export const SubscriptionStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfileStore();

  useEffect(() => {
    // Clear cache when user logs out
    if (!profile) {
      subscriptionStore.clearCache();
    }
  }, [profile]);

  return <SubscriptionStoreContext.Provider value={subscriptionStore}>{children}</SubscriptionStoreContext.Provider>;
};

export const useSubscriptionStore = () => {
  const store = useContext(SubscriptionStoreContext);

  if (!store) {
    throw new Error('useSubscriptionStore must be used within SubscriptionStoreProvider');
  }

  return store;
};
