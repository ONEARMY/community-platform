import { action, makeObservable, observable, runInAction } from 'mobx';
import type { UsefulContentType } from 'oa-shared';
import { createContext, useContext, useEffect } from 'react';
import { trackEvent } from 'src/common/Analytics';
import { usefulService } from 'src/services/usefulService';
import { useProfileStore } from '../Profile/profile.store';

type UsefulVoteKey = `${UsefulContentType}-${number}`;

interface UsefulVoteState {
  hasVoted: boolean;
  usefulCount: number;
  isLoading: boolean;
}

export class UsefulVoteStore {
  votes: Map<UsefulVoteKey, UsefulVoteState> = new Map();

  constructor() {
    makeObservable(this, {
      votes: observable,
      initializeVote: action,
      toggleVote: action,
      clearCache: action,
    });
  }

  private getCacheKey(contentType: UsefulContentType, contentId: number): UsefulVoteKey {
    return `${contentType}-${contentId}`;
  }

  getVoteState(contentType: UsefulContentType, contentId: number): UsefulVoteState | undefined {
    const key = this.getCacheKey(contentType, contentId);
    return this.votes.get(key);
  }

  hasVoted(contentType: UsefulContentType, contentId: number): boolean {
    const key = this.getCacheKey(contentType, contentId);
    return this.votes.get(key)?.hasVoted ?? false;
  }

  getUsefulCount(contentType: UsefulContentType, contentId: number): number {
    const key = this.getCacheKey(contentType, contentId);
    return this.votes.get(key)?.usefulCount ?? 0;
  }

  isLoading(contentType: UsefulContentType, contentId: number): boolean {
    const key = this.getCacheKey(contentType, contentId);
    return this.votes.get(key)?.isLoading ?? false;
  }

  async initializeVote(contentType: UsefulContentType, contentId: number, initialUsefulCount: number, isLoggedIn: boolean): Promise<void> {
    const key = this.getCacheKey(contentType, contentId);
    const existing = this.votes.get(key);

    // If already initialized and not loading, don't reinitialize
    if (existing && !existing.isLoading) {
      return;
    }

    // If already loading, wait for it to complete
    if (existing?.isLoading) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const state = this.votes.get(key);
          if (state && !state.isLoading) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
      });
    }

    // Set initial state with loading
    this.votes.set(key, {
      hasVoted: false,
      usefulCount: initialUsefulCount,
      isLoading: true,
    });

    // Check if user has voted (backend will return false if not logged in)
    try {
      const hasVoted = isLoggedIn ? await usefulService.hasVoted(contentType, contentId) : false;

      runInAction(() => {
        const currentState = this.votes.get(key);
        if (currentState) {
          this.votes.set(key, {
            ...currentState,
            hasVoted,
            isLoading: false,
          });
        }
      });
    } catch (error) {
      console.error('Failed to check vote status:', error);
      runInAction(() => {
        const currentState = this.votes.get(key);
        if (currentState) {
          this.votes.set(key, {
            ...currentState,
            isLoading: false,
          });
        }
      });
    }
  }

  async toggleVote(contentType: UsefulContentType, contentId: number): Promise<boolean> {
    const key = this.getCacheKey(contentType, contentId);
    const currentState = this.votes.get(key);

    if (!currentState) {
      console.error('Vote state not initialized');
      return false;
    }

    const newHasVoted = !currentState.hasVoted;
    const newCount = newHasVoted ? currentState.usefulCount + 1 : currentState.usefulCount - 1;

    // Optimistic update
    this.votes.set(key, {
      hasVoted: newHasVoted,
      usefulCount: newCount,
      isLoading: true,
    });

    try {
      if (newHasVoted) {
        await usefulService.add(contentType, contentId);
      } else {
        await usefulService.remove(contentType, contentId);
      }

      runInAction(() => {
        this.votes.set(key, {
          hasVoted: newHasVoted,
          usefulCount: newCount,
          isLoading: false,
        });
      });

      // Track analytics
      trackEvent({
        category: contentType,
        action: newHasVoted ? 'useful' : 'usefulRemoved',
        label: `${contentId}`,
      });

      return true;
    } catch (error) {
      console.error('Failed to toggle vote:', error);

      // Rollback optimistic update
      runInAction(() => {
        this.votes.set(key, {
          hasVoted: currentState.hasVoted,
          usefulCount: currentState.usefulCount,
          isLoading: false,
        });
      });

      return false;
    }
  }

  clearCache() {
    this.votes.clear();
  }
}

// Singleton instance
const usefulVoteStore = new UsefulVoteStore();
const UsefulVoteStoreContext = createContext<UsefulVoteStore | null>(null);

export const UsefulVoteStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfileStore();

  useEffect(() => {
    // Clear cache when user logs out
    if (!profile) {
      usefulVoteStore.clearCache();
    }
  }, [profile]);

  return <UsefulVoteStoreContext.Provider value={usefulVoteStore}>{children}</UsefulVoteStoreContext.Provider>;
};

export const useUsefulVoteStore = () => {
  const store = useContext(UsefulVoteStoreContext);

  if (!store) {
    throw new Error('useUsefulVoteStore must be used within UsefulVoteStoreProvider');
  }

  return store;
};
