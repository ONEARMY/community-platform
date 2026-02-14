import type { SubscribableContentTypes } from 'oa-shared';
import { useEffect } from 'react';
import { useProfileStore } from '../Profile/profile.store';
import { useSubscriptionStore } from './subscription.store';

/**
 * Custom hook to manage subscription state for a specific content item.
 * Automatically loads subscription status when user is logged in.
 *
 * @example
 * ```tsx
 * const { isSubscribed, toggle, isLoading } = useSubscription('comments', comment.id);
 *
 * return (
 *   <FollowButton
 *     isFollowing={isSubscribed ?? false}
 *     onFollowClick={toggle}
 *   />
 * );
 * ```
 */
export const useSubscription = (contentType: SubscribableContentTypes, itemId: number) => {
  const subscriptionStore = useSubscriptionStore();
  const { profile } = useProfileStore();

  // Auto-load subscription status if user is logged in
  useEffect(() => {
    if (profile) {
      subscriptionStore.checkAndCacheSubscription(contentType, itemId);
    }
  }, [profile, contentType, itemId, subscriptionStore]);

  return {
    isSubscribed: subscriptionStore.isSubscribed(contentType, itemId),
    isLoading: subscriptionStore.isLoading(contentType, itemId),
    subscribe: () => subscriptionStore.subscribe(contentType, itemId),
    unsubscribe: () => subscriptionStore.unsubscribe(contentType, itemId),
    toggle: () => subscriptionStore.toggleSubscription(contentType, itemId),
  };
};
