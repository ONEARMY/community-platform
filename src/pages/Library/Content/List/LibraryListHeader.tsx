import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import debounce from 'debounce';
import { CategoryHorizonalList, Icon, ReturnPathLink, SearchField, Select, Tooltip } from 'oa-components';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { UserAction } from 'src/common/UserAction';
import { useMobile } from 'src/hooks/useMobile';
import { CollapsibleSearch } from 'src/pages/common/CollapsibleSearch/CollapsibleSearch';
import DraftButton from 'src/pages/common/Drafts/DraftButton';
import { FilterSortModal } from 'src/pages/common/FilterSortModal/FilterSortModal';
import { ListHeader } from 'src/pages/common/Layout/ListHeader';
import { categoryService } from 'src/services/categoryService';
import { Box, Button, Flex } from 'theme-ui';

import { listing } from '../../labels';
import { LibrarySearchParams } from '../../library.service';
import { LibrarySortOptions } from './LibrarySortOptions';

import type { Category } from 'oa-shared';
import type { LibrarySortOption } from './LibrarySortOptions';

interface IProps {
  itemCount?: number;
  draftCount: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

export const LibraryListHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props;
  const isMobile = useMobile();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(LibrarySearchParams.q);
  const [searchString, setSearchString] = useState<string>(q ?? '');

  const categoryParam = Number(searchParams.get(LibrarySearchParams.category));
  const category = categories?.find((x) => x.id === categoryParam) ?? null;
  const sort = searchParams.get(LibrarySearchParams.sort) as LibrarySortOption;

  const headingTitle = import.meta.env.VITE_HOWTOS_HEADING;

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await categoryService.getCategories('projects')) || [];
      setCategories(categories);
    };

    initCategories();
  }, []);

  const updateFilter = useCallback(
    (key: LibrarySearchParams, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      setSearchParams(params);
    },
    [searchParams],
  );

  const onSearchInputChange = useCallback(
    debounce((value: string) => {
      searchValue(value);
    }, 500),
    [searchParams],
  );

  const searchValue = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(LibrarySearchParams.q, value);

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set(LibrarySearchParams.sort, 'MostRelevant');
    }

    if (value.length === 0 || !value) {
      params.set(LibrarySearchParams.sort, 'MostUsefulLastWeek');
    }

    setSearchParams(params);
  };

  // Calculate active filter count for badge (only category, not sort)
  const activeFilterCount = useMemo(() => {
    return category ? 1 : 0;
  }, [category]);

  // Generate results text
  const resultsText = useMemo(() => {
    if (!q) return undefined;
    return `${itemCount || 0} ${(itemCount || 0) === 1 ? 'result' : 'results'} for "${q}"`;
  }, [q, itemCount]);

  const handleFilterModalApply = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  const handleFilterModalReset = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(LibrarySearchParams.category);
    setSearchParams(params);
    setIsFilterModalOpen(false);
  }, [searchParams, setSearchParams]);

  const categoryComponent = (
    <CategoryHorizonalList
      allCategories={categories}
      activeCategory={category}
      setActiveCategory={(updatedCategory) =>
        updateFilter(LibrarySearchParams.category, (updatedCategory?.id || '').toString())
      }
    />
  );

  // Mobile filtering components
  // Only rendered when isMobile is true (screen width <= 640px)
  const mobileFilteringComponents = isMobile ? (
    <Flex
      sx={{
        gap: 2,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* Filter & Sort Button */}
      <Box sx={{ position: 'relative' }}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFilterModalOpen(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            minWidth: '48px',
            height: '48px',
            borderColor: 'lightgrey',
          }}
        >
          <Icon glyph="filter" size={20} />
        </Button>
        {activeFilterCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: 'red2',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {activeFilterCount}
          </Box>
        )}
      </Box>

      {/* Collapsible Search */}
      <Box sx={{ flex: 1 }}>
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
          dataCy="library-search-box"
          resultsText={resultsText}
        />
      </Box>
    </Flex>
  ) : null;

  // Desktop filtering components
  // Only rendered when isMobile is false (screen width > 640px)
  // Matches live page: column until 768px (52em), then row
  const desktopFilteringComponents = !isMobile ? (
    <Flex sx={{ gap: 2, flexDirection: ['column', 'column', 'row'], flexWrap: 'wrap' }}>
      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
        <FieldContainer>
          <Select
            options={LibrarySortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={{
              label: LibrarySortOptions.get(sort),
              value: sort,
            }}
            onChange={(sortBy) => updateFilter(LibrarySearchParams.sort, sortBy.value)}
          />
        </FieldContainer>
      </Flex>
      <Flex sx={{ width: ['100%', '100%', '270px'] }}>
        <SearchField
          dataCy="library-search-box"
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

  const actionComponents = (
    <UserAction
      incompleteProfile={
        <>
          <Link
            to="/settings"
            data-tooltip-id="tooltip"
            data-tooltip-content={listing.incompleteProfile}
          >
            <Button type="button" data-cy="complete-profile-project" variant="disabled">
              {listing.create}
            </Button>
          </Link>
          <Tooltip id="tooltip" />
        </>
      }
      loggedIn={
        <>
          <DraftButton
            showDrafts={showDrafts}
            draftCount={draftCount}
            handleShowDrafts={handleShowDrafts}
          />
          <Link to="/library/create">
            <Button type="button" sx={{ width: '100%' }} variant="primary" data-cy="create-project">
              {listing.create}
            </Button>
          </Link>
        </>
      }
      loggedOut={
        <ReturnPathLink to="/sign-up">
          <Button type="button" sx={{ width: '100%' }} variant="primary" data-cy="sign-up">
            {listing.join}
          </Button>
        </ReturnPathLink>
      }
    />
  );

  return (
    <>
      <ListHeader
        itemCount={showDrafts ? draftCount : itemCount}
        actionComponents={actionComponents}
        showDrafts={showDrafts}
        headingTitle={headingTitle}
        categoryComponent={categoryComponent}
        filteringComponents={filteringComponents}
      />
      {isMobile && (
        <FilterSortModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleFilterModalApply}
          onReset={handleFilterModalReset}
          sortOptions={LibrarySortOptions.toArray(!!q)}
          sortLabel="Sort"
          selectedSortValue={sort || ''}
          onSortChange={(value) => updateFilter(LibrarySearchParams.sort, value)}
          title="Sort"
        />
      )}
    </>
  );
};
