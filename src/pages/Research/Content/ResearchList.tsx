import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button, Loader } from 'oa-components';
import { logger } from 'src/logger';
import useDrafts from 'src/pages/common/Drafts/useDraftsSupabase';
import { Box, Flex } from 'theme-ui';

import { listing } from '../labels';
import { researchService } from '../research.service';
import { ResearchFilterHeader } from './ResearchListHeader';
import ResearchListItem from './ResearchListItem';
import { ResearchSearchParams } from './ResearchSearchParams';

import type { ResearchItem, ResearchStatus } from 'oa-shared';
import type { ResearchSortOption } from '../ResearchSortOptions';

const ResearchList = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<ResearchItem>({
      getDraftCount: researchService.getDraftCount,
      getDrafts: researchService.getDrafts,
    });
  const [total, setTotal] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(ResearchSearchParams.q) || '';
  const category = searchParams.get(ResearchSearchParams.category) || '';
  const status = searchParams.get(ResearchSearchParams.status) as ResearchStatus | null;
  const sortParam = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption | null;
  
  // Compute default sort value immediately using useMemo to avoid race condition
  // This ensures the dropdown always has a value, even before URL is updated
  const defaultSort = useMemo<ResearchSortOption>(() => {
    return q ? 'MostRelevant' : 'LatestUpdated';
  }, [q]);
  
  // Use sortParam if available, otherwise fall back to defaultSort
  // This ensures sort is always defined synchronously, preventing empty dropdown
  const sort = sortParam || defaultSort;

  const fetchResearchItems = useCallback(
    async (skip: number = 0) => {
      setIsFetching(true);

      try {
        const result = await researchService.search(
          q?.toLocaleLowerCase(),
          category,
          sort,
          status,
          skip,
        );

        if (result) {
          if (skip) {
            // if skipFrom is set, means we are requesting another page that should be appended
            setResearchItems((items) => [...items, ...result.items]);
          } else {
            setResearchItems(result.items);
          }

          setTotal(result.total);
        }
      } catch (error) {
        logger.error('error fetching research items', error);
      }

      setIsFetching(false);
    },
    [q, category, sort, status],
  );

  useEffect(() => {
    // Only update URL if sort parameter is missing, but use computed sort for rendering
    if (!sortParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(ResearchSearchParams.sort, defaultSort);
      setSearchParams(params, { replace: true });
    }
  }, [q, sortParam, defaultSort, searchParams, setSearchParams]);

  useEffect(() => {
    // Fetch research items whenever filters change
    // sort is always defined (either from URL or default), so this is safe
    fetchResearchItems();
  }, [fetchResearchItems]);

  const researchItemList = showDrafts ? drafts : researchItems;

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <ResearchFilterHeader
        itemCount={total}
        draftCount={draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      {((researchItems && researchItems.length !== 0) || showDrafts) && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} data-cy="ResearchList">
          {researchItemList.map((item) => (
            <ResearchListItem
              key={item.id}
              item={item}
              showWeeklyVotes={sort === 'MostUsefulLastWeek'}
            />
          ))}
        </ul>
      )}

      {!isFetching && researchItems?.length === 0 && (
        <Box sx={{ marginBottom: 5 }}>{listing.noItems}</Box>
      )}

      {!isFetching && researchItems && researchItems.length > 0 && researchItems.length < total && (
        <Flex
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button
            type="button"
            data-cy="loadMoreButton"
            onClick={() => fetchResearchItems(researchItems.length)}
          >
            {listing.loadMore}
          </Button>
        </Flex>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}
    </Flex>
  );
};

export default ResearchList;
