import { Button, Loader } from 'oa-components';
import type { ResearchItem, ResearchStatus } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { logger } from 'src/logger';
import useDrafts from 'src/pages/common/Drafts/useDraftsSupabase';
import { Box, Flex } from 'theme-ui';
import { listing } from '../labels';
import type { ResearchSortOption } from '../ResearchSortOptions';
import { researchService } from '../research.service';
import { ResearchFilterHeader } from './ResearchListHeader';
import ResearchListItem from './ResearchListItem';
import { ResearchSearchParams } from './ResearchSearchParams';

const ResearchList = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<ResearchItem>({
      getDraftCount: researchService.getDraftCount,
      getDrafts: researchService.getDrafts,
    });
  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(ResearchSearchParams.q) || '';
  const category = searchParams.get(ResearchSearchParams.category) || '';
  const status = searchParams.get(ResearchSearchParams.status) as ResearchStatus | null;
  const sort = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption;

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString());

      if (q) {
        params.set(ResearchSearchParams.sort, 'MostRelevant');
      } else {
        params.set(ResearchSearchParams.sort, 'LatestUpdated');
      }
      setSearchParams(params, { replace: true });
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchResearchItems();
    }
  }, [q, category, status, sort]);

  const fetchResearchItems = async (skip: number = 0) => {
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
  };

  const researchItemList = showDrafts ? drafts : researchItems;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: [2, 3],
        maxWidth: ['639px', '791px', '1000px'],
        width: '100%',
        mx: 'auto',
      }}
    >
      <ResearchFilterHeader
        itemCount={isFetching ? undefined : total}
        draftCount={isFetchingDrafts ? undefined : draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      {((researchItems && researchItems.length !== 0) || showDrafts) && (
        <Box
          as="ul"
          data-cy="ResearchList"
          sx={{
            listStyle: 'none',
            p: 0,
            m: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: [0, 2],
          }}
        >
          {researchItemList.map((item) => (
            <ResearchListItem
              key={item.id}
              item={item}
              showWeeklyVotes={sort === 'MostUsefulLastWeek'}
            />
          ))}
        </Box>
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
