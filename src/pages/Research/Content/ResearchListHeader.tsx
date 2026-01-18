import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import debounce from 'debounce';
import { CategoryHorizonalList, ReturnPathLink, SearchField, Select, Tooltip } from 'oa-components';
import { ResearchStatusRecord, UserRole } from 'oa-shared';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { UserAction } from 'src/common/UserAction';
import { isPreciousPlastic } from 'src/config/config';
import { useMobile } from 'src/hooks/useMobile';
import { CollapsibleSearch } from 'src/pages/common/CollapsibleSearch/CollapsibleSearch';
import DraftButton from 'src/pages/common/Drafts/DraftButton';
import { FilterSortModal } from 'src/pages/common/FilterSortModal/FilterSortModal';
import { ListHeader } from 'src/pages/common/Layout/ListHeader';
import { categoryService } from 'src/services/categoryService';
import { Box, Button, Flex } from 'theme-ui';

import { listing } from '../labels';
import { ResearchSortOptions } from '../ResearchSortOptions';
import { ResearchSearchParams } from './ResearchSearchParams';

import type { Category, ResearchStatus } from 'oa-shared';
import type { ResearchSortOption } from '../ResearchSortOptions';

interface IProps {
  itemCount: number;
  draftCount: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

const researchStatusOptions: { label: string; value: ResearchStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Completed', value: 'complete' },
];

export const ResearchFilterHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props;

  const isMobile = useMobile();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(ResearchSearchParams.q);
  const [searchString, setSearchString] = useState<string>(q ?? '');

  const categoryParam = Number(searchParams.get(ResearchSearchParams.category));
  const category = categories?.find((x) => x.id === categoryParam) ?? null;
  const sort = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption;
  const status = (searchParams.get(ResearchSearchParams.status) as ResearchStatus) || '';

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await categoryService.getCategories('research')) || [];
      setCategories(categories);
    };

    initCategories();
  }, []);

  const updateFilter = useCallback(
    (key: ResearchSearchParams, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const onSearchInputChange = useCallback(
    debounce((value: string) => {
      searchValue(value);
    }, 500),
    [searchParams],
  );

  const searchValue = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(ResearchSearchParams.q, value);

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set(ResearchSearchParams.sort, 'MostRelevant');
    }

    if (value.length === 0 || !value) {
      params.set(ResearchSearchParams.sort, 'LatestUpdated');
    }

    setSearchParams(params);
  };

  // Calculate active filter count for badge (includes filters and sorting changes)
  // Only count filters/sorting that are different from defaults
  // Badge should ONLY appear after user explicitly clicks "Apply" in the modal
  const activeFilterCount = useMemo(() => {
    // Don't show badge if filters haven't been applied via modal
    if (!hasAppliedFilters) {
      return 0;
    }

    let count = 0;
    // Count status only if it's explicitly set in URL and not "All" (empty string is default)
    const statusParam = searchParams.get(ResearchSearchParams.status);
    if (statusParam && statusParam !== '') count++;
    // Count category only if one is explicitly selected in URL (not in URL means default)
    const categoryParam = searchParams.get(ResearchSearchParams.category);
    if (categoryParam && categoryParam !== '') count++;
    // Count sort only if it's explicitly set in URL and different from default
    // Default is 'LatestUpdated' when no search query, 'MostRelevant' when there's a search query
    // IMPORTANT: Sort is always auto-set in URL by ResearchList, so we need to compare carefully
    const sortParam = searchParams.get(ResearchSearchParams.sort);
    // Check if there's actually a search query (not just empty string or whitespace)
    const hasSearchQuery = q != null && q.trim().length > 0;
    const expectedDefaultSort = hasSearchQuery ? 'MostRelevant' : 'LatestUpdated';
    // Only count if sort exists AND is different from the expected default
    // This means the user explicitly changed it from what it should be
    if (sortParam && sortParam !== expectedDefaultSort) {
      count++;
    }
    return count;
  }, [hasAppliedFilters, searchParams.toString(), q]);

  // Generate results text
  const resultsText = useMemo(() => {
    if (!q) return undefined;
    return `${itemCount} ${itemCount === 1 ? 'result' : 'results'} for "${q}"`;
  }, [q, itemCount]);

  const handleFilterModalApply = useCallback(() => {
    // Mark that filters have been applied via modal
    setHasAppliedFilters(true);
    setIsFilterModalOpen(false);
  }, []);

  const handleFilterModalReset = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(ResearchSearchParams.status);
    params.delete(ResearchSearchParams.category);
    setSearchParams(params);
    // Reset the applied filters flag so badge disappears
    setHasAppliedFilters(false);
    setIsFilterModalOpen(false);
  }, [searchParams, setSearchParams]);
  const roleRequired = isPreciousPlastic()
    ? undefined
    : [UserRole.ADMIN, UserRole.RESEARCH_CREATOR];
  const actionComponentsBase = (
    <UserAction
      incompleteProfile={
        <AuthWrapper roleRequired={roleRequired}>
          <Link to="/settings">
            <Button
              type="button"
              variant="primary"
              data-cy="complete-profile-research"
              data-tooltip-id="tooltip"
              data-tooltip-content={listing.incompleteProfile}
              sx={{
                width: '174px',
                height: '41px',
                borderRadius: '5px',
                border: '2px solid black',
                borderWidth: '2px',
                borderColor: 'black',
                backgroundColor: '#FEE77B',
                paddingTop: '2px',
                paddingRight: '17px',
                paddingBottom: '2px',
                paddingLeft: '17px',
                gap: '10px',
                opacity: 1,
                fontFamily: 'Varela Round',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '100%',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& > *': {
                  fontFamily: 'Varela Round',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  textAlign: 'center',
                  opacity: 1,
                  width: '140px',
                  height: '19px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                '&:hover': {
                  backgroundColor: '#FEE77B',
                  opacity: 1,
                },
                '&:active': {
                  backgroundColor: '#FEE77B',
                  opacity: 1,
                },
              }}
            >
              {listing.create}
            </Button>
          </Link>
          <Tooltip id="tooltip" />
        </AuthWrapper>
      }
      loggedIn={
        <AuthWrapper roleRequired={roleRequired}>
          <DraftButton
            showDrafts={showDrafts}
            draftCount={draftCount}
            handleShowDrafts={handleShowDrafts}
          />
          <Link to="/research/create">
            <Button
              type="button"
              variant="primary"
              data-cy="create"
              sx={{
                width: '174px',
                height: '41px',
                borderRadius: '5px',
                border: '2px solid black',
                borderWidth: '2px',
                borderColor: 'black',
                backgroundColor: '#FEE77B',
                paddingTop: '2px',
                paddingRight: '17px',
                paddingBottom: '2px',
                paddingLeft: '17px',
                gap: '10px',
                opacity: 1,
                fontFamily: 'Varela Round',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '100%',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& > *': {
                  fontFamily: 'Varela Round',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  textAlign: 'center',
                  opacity: 1,
                  width: '140px',
                  height: '19px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                '&:hover': {
                  backgroundColor: '#FEE77B',
                  opacity: 1,
                },
                '&:active': {
                  backgroundColor: '#FEE77B',
                  opacity: 1,
                },
              }}
            >
              {listing.create}
            </Button>
          </Link>
        </AuthWrapper>
      }
      loggedOut={
        isPreciousPlastic() && (
          <ReturnPathLink to="/sign-up">
            <Button type="button" variant="primary" data-cy="sign-up">
              {listing.join}
            </Button>
          </ReturnPathLink>
        )
      }
    />
  );

  const actionComponents = actionComponentsBase;

  const categoryComponent = (
    <CategoryHorizonalList
      allCategories={categories}
      activeCategory={category}
      setActiveCategory={(updatedCategory) =>
        updateFilter(
          ResearchSearchParams.category,
          updatedCategory ? (updatedCategory as Category).id.toString() : '',
        )
      }
    />
  );

  // Mobile filtering components - filter and search buttons on the left
  // Only rendered when isMobile is true (screen width <= 640px)
  const mobileFilteringComponents = isMobile ? (
    <Flex
      sx={{
        gap: isSearchExpanded ? 0 : 2,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        width: '100%',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Filter & Sort Button - hide when search is expanded */}
      {!isSearchExpanded && (
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFilterModalOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '11px',
              width: '44px',
              height: '44px',
              minWidth: '44px',
              border: '2px solid black',
              borderColor: 'black',
              borderRadius: '7px',
              color: 'black',
              '& svg': {
                color: 'black',
                fill: 'none',
                stroke: 'black',
              },
              '&:hover': {
                borderColor: 'black',
                color: 'black',
              },
              '&:active': {
                borderColor: 'black',
                color: 'black',
              },
            }}
          >
            <Box
              as="svg"
              width="22"
              height="22"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              sx={{
                display: 'block',
                flexShrink: 0,
              }}
            >
              <path
                d="M6.19645 9.67961C6.70252 9.67979 7.11306 10.0902 7.11312 10.5963C7.11312 11.1024 6.70256 11.5128 6.19645 11.5129H4.47323V16.756C4.47323 17.2622 4.06269 17.6725 3.55656 17.6727C3.0503 17.6727 2.63989 17.2623 2.63989 16.756V11.5129H0.916667C0.410406 11.5129 0 11.1025 0 10.5963C6.04904e-05 10.0901 0.410443 9.67961 0.916667 9.67961H6.19645Z"
                fill="black"
              />
              <path
                d="M10.5963 7.91968C11.1025 7.91968 11.5129 8.33013 11.5129 8.83634V16.756C11.5129 17.2623 11.1025 17.6727 10.5963 17.6727C10.09 17.6727 9.67961 17.2623 9.67961 16.756V8.83634C9.67967 8.33013 10.09 7.91968 10.5963 7.91968Z"
                fill="black"
              />
              <path
                d="M20.2768 11.4395C20.7829 11.4395 21.1933 11.8501 21.1934 12.3562C21.1934 12.8625 20.783 13.2729 20.2768 13.2729H18.5535V16.756C18.5535 17.2623 18.1431 17.6727 17.6369 17.6727C17.1307 17.6726 16.7202 17.2622 16.7202 16.756V13.2729H14.997C14.4907 13.2729 14.0803 12.8625 14.0803 12.3562C14.0805 11.8501 14.4908 11.4395 14.997 11.4395H20.2768Z"
                fill="black"
              />
              <path
                d="M17.6369 0C18.1431 0 18.5535 0.410406 18.5535 0.916667V8.83634C18.5534 9.3425 18.1431 9.75301 17.6369 9.75301C17.1307 9.75295 16.7203 9.34247 16.7202 8.83634V0.916667C16.7202 0.410443 17.1307 6.04832e-05 17.6369 0Z"
                fill="black"
              />
              <path
                d="M3.55656 0C4.06269 0.000151188 4.47323 0.410499 4.47323 0.916667V7.07642C4.47311 7.58248 4.06262 7.99293 3.55656 7.99308C3.05037 7.99308 2.64001 7.58257 2.63989 7.07642V0.916667C2.63989 0.410406 3.0503 0 3.55656 0Z"
                fill="black"
              />
              <path
                d="M10.5963 0C11.1025 0 11.5129 0.410406 11.5129 0.916667V4.39982H13.2362C13.7424 4.39985 14.1528 4.81025 14.1528 5.31649C14.1528 5.82268 13.7424 6.23312 13.2362 6.23315H7.95638C7.45016 6.23315 7.03977 5.8227 7.03971 5.31649C7.03971 4.81023 7.45012 4.39982 7.95638 4.39982H9.67961V0.916667C9.67961 0.410406 10.09 0 10.5963 0Z"
                fill="black"
              />
            </Box>
          </Button>
          {activeFilterCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#E9475A',
                color: 'white',
                borderRadius: '100px',
                border: '2px solid #FFFFFF',
                width: '18px',
                height: '18px',
                minWidth: '18px',
                minHeight: '18px',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                boxSizing: 'border-box',
                zIndex: 1,
              }}
            >
              {activeFilterCount}
            </Box>
          )}
        </Box>
      )}

      {/* Collapsible Search - takes full width when expanded */}
      <Box sx={{ flex: 1, minWidth: 0, width: '100%', maxWidth: '100%' }}>
        <CollapsibleSearch
          value={searchString}
          onChange={(value) => {
            setSearchString(value);
            onSearchInputChange(value);
          }}
          onSearch={() => searchValue(searchString)}
          onClear={() => {
            setSearchString('');
            searchValue('');
          }}
          placeholder={listing.search}
          dataCy="research-search-box"
          resultsText={resultsText}
          onExpandChange={setIsSearchExpanded}
        />
      </Box>
    </Flex>
  ) : null;

  // Desktop filtering components
  // Only rendered when isMobile is false (screen width > 640px)
  // Matches live page: column until 768px (52em), then row
  const desktopFilteringComponents = !isMobile ? (
    <Flex
      sx={{
        gap: 2,
        flexDirection: ['column', 'column', 'row'],
        flexWrap: 'wrap',
      }}
    >
      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
        <FieldContainer>
          <Select
            options={ResearchSortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={{ label: ResearchSortOptions.get(sort), value: sort }}
            onChange={(sortBy) => updateFilter(ResearchSearchParams.sort, sortBy.value)}
          />
        </FieldContainer>
      </Flex>

      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
        <FieldContainer>
          <Select
            options={researchStatusOptions}
            placeholder={listing.status}
            value={status ? { label: ResearchStatusRecord[status], value: status } : undefined}
            onChange={(status) => updateFilter(ResearchSearchParams.status, status.value)}
          />
        </FieldContainer>
      </Flex>

      <Flex sx={{ width: ['100%', '100%', '270px'] }}>
        <SearchField
          dataCy="research-search-box"
          placeHolder={listing.search}
          value={searchString}
          onChange={(value) => {
            setSearchString(value);
            onSearchInputChange(value);
          }}
          onClickDelete={() => {
            setSearchString('');
            searchValue('');
          }}
          onClickSearch={() => searchValue(searchString)}
        />
      </Flex>
    </Flex>
  ) : null;

  // Ensure only one set of filtering components is used based on screen size
  // Mobile: screen width <= 640px
  // Desktop: screen width > 640px
  const filteringComponents = isMobile ? mobileFilteringComponents : desktopFilteringComponents;

  return (
    <>
      <ListHeader
        itemCount={showDrafts ? draftCount : itemCount}
        actionComponents={isMobile && isSearchExpanded ? null : actionComponents}
        showDrafts={showDrafts}
        headingTitle={listing.heading}
        categoryComponent={categoryComponent}
        filteringComponents={filteringComponents}
      />
      {isMobile && (
        <FilterSortModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleFilterModalApply}
          onReset={handleFilterModalReset}
          filterOptions={researchStatusOptions.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
          filterLabel="Status"
          selectedFilterValue={status}
          onFilterChange={(value) => updateFilter(ResearchSearchParams.status, value)}
          sortOptions={ResearchSortOptions.toArray(!!q)}
          sortLabel="Sort"
          selectedSortValue={sort || ''}
          onSortChange={(value) => updateFilter(ResearchSearchParams.sort, value)}
        />
      )}
    </>
  );
};
