import { Loader, Pagination } from 'oa-components';
import type { News } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { logger } from 'src/logger';
import { newsContentService } from 'src/pages/News/newsContent.service';
import { Flex, Heading } from 'theme-ui';
import useDrafts from '../common/Drafts/useDraftsSupabase';
import { ITEMS_PER_PAGE } from './constants';
import { listing } from './labels';
import { NewsListHeader } from './NewsListHeader';
import { NewsListItem } from './NewsListItem';
import type { NewsSortOption } from './NewsSortOptions';

export const NewsListing = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [news, setNews] = useState<News[]>([]);
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } = useDrafts<News>({
    getDraftCount: newsContentService.getDraftCount,
    getDrafts: newsContentService.getDrafts,
  });
  const [total, setTotal] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') as NewsSortOption;
  const pageNumber = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);

  useEffect(() => {
    if (!sort) {
      const params = new URLSearchParams(searchParams.toString());

      if (q) {
        params.set('sort', 'MostRelevant');
      } else {
        params.set('sort', 'Newest');
      }
      setSearchParams(params, { replace: true });
    } else {
      // search only when sort is set (avoids duplicate requests)
      const skip = (pageNumber - 1) * ITEMS_PER_PAGE;
      fetchNews(skip);
    }
  }, [q, sort, pageNumber]);

  const fetchNews = async (skip: number = 0) => {
    setIsFetching(true);

    try {
      const result = await newsContentService.search(q, sort, skip);
      if (result) {
        setNews(result.items);
        setTotal(result.total);
      }
    } catch (error) {
      logger.error('error fetching news', error);
    }

    setIsFetching(false);
  };

  const updatePageNumber = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    setSearchParams(params, { replace: true });
  };

  const showLoadMore = !isFetching && news && news.length > 0;

  const newsList = showDrafts ? drafts : news;

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', padding: [2, 0, 0] }}>
      <NewsListHeader
        draftCount={draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      <Flex
        sx={{
          flexDirection: 'column',
          gap: [2, 4],
          width: '100%',
          maxWidth: '650px',
        }}
      >
        {news?.length === 0 && !isFetching && (
          <Heading as="h1" sx={{ marginTop: 4 }}>
            {listing.noNews}
          </Heading>
        )}

        {newsList && newsList.length > 0 && (
          <Flex
            as="ul"
            sx={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              flexDirection: 'column',
              gap: [2, 4],
            }}
            variant="responsive"
          >
            {newsList.map((news, index) => (
              <NewsListItem key={index} news={news} query={q} />
            ))}
          </Flex>
        )}

        {showLoadMore && (
          <Flex sx={{ justifyContent: 'center' }}>
            <Pagination
              totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
              onPageChange={updatePageNumber}
              page={pageNumber}
            />
          </Flex>
        )}
      </Flex>
      {(isFetching || isFetchingDrafts) && <Loader />}
    </Flex>
  );
};
