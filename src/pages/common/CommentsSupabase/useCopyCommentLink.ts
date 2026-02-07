import type { Comment, Reply } from 'oa-shared';
import { useCallback } from 'react';
import { useLocation } from 'react-router';

export const useCopyCommentLink = (comment: Comment | Reply) => {
  const location = useLocation();

  return useCallback(async () => {
    try {
      const baseUrl = `${window.location.origin}${location.pathname}`;
      let url = `${baseUrl}#comment:${comment.id}`;

      if (comment.sourceType === 'research_updates') {
        const searchParams = new URLSearchParams(location.search);
        const updateParam = Array.from(searchParams.keys()).find((key) =>
          key.startsWith('update_'),
        );
        const updateId = updateParam ? updateParam.split('_')[1] : comment.sourceId;
        url = `${baseUrl}?update_${updateId}#comment:${comment.id}`;
      }

      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Failed to copy comment link:', error);
    }
  }, [comment.id, comment.sourceId, comment.sourceType, location.pathname, location.search]);
};
