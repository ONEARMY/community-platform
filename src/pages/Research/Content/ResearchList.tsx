import { Loader, Pagination } from 'oa-components';
import type { ResearchItem, ResearchStatus } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { logger } from 'src/logger';
import useDrafts from 'src/pages/common/Drafts/useDraftsSupabase';
import { Box, Flex } from 'theme-ui';
import { ITEMS_PER_PAGE } from '../constants';
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
  const pageNumber = searchParams.get(ResearchSearchParams.pageNo) as ResearchSortOption;

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
      const skip = (parseInt(pageNumber) || 0) * ITEMS_PER_PAGE;
      fetchResearchItems(skip);
    }
  }, [q, category, status, sort, pageNumber]);

  const updatePageNumber = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(ResearchSearchParams.pageNo, value.toString());
    setSearchParams(params, { replace: true });
  };

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
        setResearchItems(result.items);
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
            gap: 2,
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

      {!isFetching && researchItems && researchItems.length > 0 && (
        <Flex
          sx={{
            justifyContent: 'center',
          }}
        >
          <Pagination
            totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
            onPageChange={updatePageNumber}
            page={parseInt(pageNumber) || 0}
          />
        </Flex>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}
    </Flex>
  );
};

export default ResearchList;
