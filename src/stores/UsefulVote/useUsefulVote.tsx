import type { UsefulContentType } from 'oa-shared';
import { useContext, useEffect } from 'react';
import { SessionContext } from 'src/pages/common/SessionContext';
import { useUsefulVoteStore } from './usefulVote.store';

export function useUsefulVote(contentType: UsefulContentType, contentId: number, initialUsefulCount: number) {
  const store = useUsefulVoteStore();
  const claims = useContext(SessionContext);

  const isLoggedIn = !!claims?.sub;

  useEffect(() => {
    store.initializeVote(contentType, contentId, initialUsefulCount, isLoggedIn);
  }, [store, contentType, contentId, initialUsefulCount, isLoggedIn]);

  const voteState = store.getVoteState(contentType, contentId);
  const hasVoted = voteState?.hasVoted ?? false;
  const usefulCount = voteState?.usefulCount ?? initialUsefulCount;
  const isLoading = voteState?.isLoading ?? false;

  const toggle = async () => {
    if (!isLoggedIn) {
      return;
    }
    await store.toggleVote(contentType, contentId);
  };

  return {
    hasVoted,
    usefulCount,
    isLoading,
    toggle,
  };
}
