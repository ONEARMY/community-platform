import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button, Loader } from 'oa-components';
import { logger } from 'src/logger';
import { newsContentService } from 'src/pages/News/newsContent.service';
import { Flex, Heading } from 'theme-ui';

import useDrafts from '../common/Drafts/useDraftsSupabase';
import { listing } from './labels';
import { NewsListHeader } from './NewsListHeader';
import { NewsListItem } from './NewsListItem';

import type { News } from 'oa-shared';
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

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString());

      if (q) {
        params.set('sort', 'MostRelevant');
      } else {
        params.set('sort', 'Newest');
      }
      setSearchParams(params);
    } else {
      // search only when sort is set (avoids duplicate requests)
      fetchNews();
    }
  }, [q, sort]);

  const fetchNews = async (skip: number = 0) => {
    setIsFetching(true);

    try {
      const result = await newsContentService.search(q, sort, skip);
      if (result) {
        if (skip) {
          // if skipFrom is set, means we are requesting another page that should be appended
          setNews((news) => [...news, ...result.items]);
        } else {
          setNews(result.items);
        }

        setTotal(result.total);
      }
    } catch (error) {
      logger.error('error fetching news', error);
    }

    setIsFetching(false);
  };

  const showLoadMore = !isFetching && news && news.length > 0 && news.length < total;

  const newsList = showDrafts ? drafts : news;

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 4], alignItems: 'center' }}>
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
            <Button type="button" onClick={() => fetchNews(news.length)} data-cy="load-more">
              {listing.loadMore}
            </Button>
          </Flex>
        )}
      </Flex>
      {(isFetching || isFetchingDrafts) && <Loader />}
    </Flex>
  );
};
