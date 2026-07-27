import { Loader, MoreContainer, Pagination } from 'oa-components';
import type { Project } from 'oa-shared';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { logger } from 'src/logger';
import useDrafts from 'src/pages/common/Drafts/useDraftsSupabase';
import { TenantContext } from 'src/pages/common/TenantContext';
import { Flex, Grid, Heading } from 'theme-ui';
import { ITEMS_PER_PAGE } from '../../constants';
import { LibrarySearchParams, libraryService } from '../../library.service';
import { LibraryListHeader } from './LibraryListHeader';
import type { LibrarySortOption } from './LibrarySortOptions';
import { ProjectCard } from './ProjectCard';

export const LibraryList = () => {
  const tenantContext = useContext(TenantContext);
  const [isFetching, setIsFetching] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } = useDrafts<Project>(
    {
      getDraftCount: libraryService.getDraftCount,
      getDrafts: libraryService.getDrafts,
    },
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(LibrarySearchParams.q) || '';
  const category = searchParams.get(LibrarySearchParams.category) || '';
  const sort = searchParams.get(LibrarySearchParams.sort) as LibrarySortOption;
  const pageNumber = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString());

      if (q) {
        params.set(LibrarySearchParams.sort, 'MostRelevant');
      } else {
        params.set(LibrarySearchParams.sort, 'MostUsefulLastWeek');
      }
      setSearchParams(params, { replace: true });
    } else {
      // search only when sort is set (avoids duplicate requests)
      const skip = (pageNumber - 1) * ITEMS_PER_PAGE;
      fetchProjects(skip);
    }
  }, [q, category, sort, pageNumber]);

  const fetchProjects = async (skip: number = 0) => {
    setIsFetching(true);

    try {
      const result = await libraryService.search(q?.toLocaleLowerCase(), category, sort, skip);

      if (result) {
        setProjects(result.items);
        setTotal(result.total);
      }
    } catch (error) {
      logger.error('error fetching library', error);
    }

    setIsFetching(false);
  };

  const updatePageNumber = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    setSearchParams(params, { replace: true });
  };

  const showLoadMore =
    !isFetching && !showDrafts && projects && projects.length > 0 && projects.length < total;

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <LibraryListHeader
        itemCount={isFetching ? undefined : total}
        draftCount={isFetchingDrafts ? undefined : draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      <Grid columns={[1, 2, 2, 3]} gap={[2, 3, 4]} sx={{ px: [2, 0, 0] }}>
        {showDrafts ? (
          drafts.map((item) => {
            return <ProjectCard key={item.id} item={item} />;
          })
        ) : (
          <>
            {projects &&
              projects.length > 0 &&
              projects.map((item, index) => <ProjectCard key={index} item={item} query={q} />)}
          </>
        )}
      </Grid>

      {showLoadMore && (
        <Flex
          sx={{
            justifyContent: 'center',
          }}
        >
          <Pagination
            totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
            onPageChange={updatePageNumber}
            page={pageNumber}
          />
        </Flex>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}

      <MoreContainer
        sx={{
          paddingTop: [20, 70],
          paddingBottom: [40, 90],
          paddingX: 80,
          alignSelf: 'center',
        }}
      >
        <Flex sx={{ alignItems: 'center', flexDirection: 'column' }}>
          <Heading as="p" sx={{ textAlign: 'center', maxWidth: '500px' }}>
            Contribute to the {tenantContext?.siteName || 'Community Platform'} library,
            <br />
            share your project.
          </Heading>
        </Flex>
      </MoreContainer>
    </Flex>
  );
};
