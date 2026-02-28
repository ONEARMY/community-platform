import debounce from 'debounce';
import {
  ButtonIcon,
  CategoryHorizonalList,
  ReturnPathLink,
  SearchField,
  Select,
  Tooltip,
} from 'oa-components';
import type { Category } from 'oa-shared';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { useClickOutside } from 'src/common/hooks/useClickOutside';
import { UserAction } from 'src/common/UserAction';
import DraftButton from 'src/pages/common/Drafts/DraftButton';
import { ListHeader } from 'src/pages/common/Layout/ListHeader';
import type { FilterSection } from 'src/pages/common/Layout/MobileSortModal';
import { MobileSortModal } from 'src/pages/common/Layout/MobileSortModal';
import { TenantContext } from 'src/pages/common/TenantContext';
import { categoryService } from 'src/services/categoryService';
import { Box, Button, Flex } from 'theme-ui';
import { listing } from '../../labels';
import { LibrarySearchParams } from '../../library.service';
import type { LibrarySortOption } from './LibrarySortOptions';
import { LibrarySortOptions } from './LibrarySortOptions';

interface IProps {
  itemCount?: number;
  draftCount?: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

const defaultSort: LibrarySortOption = 'MostUsefulLastWeek';

export const LibraryListHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props;
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(LibrarySearchParams.q);
  const [searchString, setSearchString] = useState<string>(q ?? '');
  const tenantContext = useContext(TenantContext);

  const categoryParam = Number(searchParams.get(LibrarySearchParams.category));
  const category = categories?.find((x) => x.id === categoryParam) ?? null;
  const sort = searchParams.get(LibrarySearchParams.sort) as LibrarySortOption;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [pendingSort, setPendingSort] = useState<LibrarySortOption>(sort || defaultSort);

  const handleOpenSortModal = () => {
    setPendingSort(sort || defaultSort);
    setIsSortModalOpen(true);
  };

  const handleCloseSortModal = () => {
    setIsSortModalOpen(false);
  };

  const handleToggleSearchOpen = () => {
    setIsSearchOpen((x) => !x);
  };

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
      params.set(LibrarySearchParams.sort, defaultSort);
    }

    setSearchParams(params);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchValue(searchString);
    setIsSearchOpen(false);
  };

  const sortOptions = LibrarySortOptions.toArray(!!q);

  const effectiveDefaultSort = q ? 'MostRelevant' : defaultSort;
  const activeFilterCount =
    (sort && sort !== effectiveDefaultSort ? 1 : 0) + (categoryParam > 0 ? 1 : 0);

  const handleApplySort = () => {
    updateFilter(LibrarySearchParams.sort, pendingSort);
    handleCloseSortModal();
  };

  const handleResetSort = () => {
    updateFilter(LibrarySearchParams.sort, defaultSort);
    setPendingSort(defaultSort);
  };

  const formRef = useClickOutside(() => {
    setIsSearchOpen(false);
  });

  const sortSections: FilterSection[] = [
    {
      title: 'Sort',
      options: sortOptions,
      selectedValue: pendingSort,
      onSelect: (value) => setPendingSort(value as LibrarySortOption),
    },
  ];

  const categoryComponent = (
    <CategoryHorizonalList
      allCategories={categories}
      activeCategory={category}
      setActiveCategory={(updatedCategory) =>
        updateFilter(LibrarySearchParams.category, (updatedCategory?.id || '').toString())
      }
    />
  );

  const filteringComponents = (
    <Flex
      sx={{
        gap: 2,
        flexDirection: ['column', 'row', 'row'],
        display: ['none', 'flex', 'flex'],
      }}
    >
      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
        <FieldContainer>
          <Select
            options={sortOptions}
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
  );

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

  const mobileFilteringComponents = (
    <Flex sx={{ display: ['flex', 'none', 'none'], gap: '5px' }}>
      <Flex sx={{ position: 'relative' }}>
        <ButtonIcon
          onClick={handleOpenSortModal}
          icon="sliders"
          sx={{
            borderRadius: 1,
            padding: '9px',
            '&:hover': {
              backgroundColor: 'background',
            },
          }}
        />
        {activeFilterCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              minWidth: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'red',
              color: 'background',
              fontSize: 0,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeFilterCount}
          </Box>
        )}
      </Flex>
      <ButtonIcon
        onClick={handleToggleSearchOpen}
        icon="search"
        sx={{
          border: 'none',
          background: 'transparent',
          '&:hover': {
            backgroundColor: 'background',
          },
        }}
      />
    </Flex>
  );

  const mobileSearchBar = (
    <Flex sx={{ display: ['flex', 'none', 'none'], width: '100%' }}>
      <div ref={formRef} style={{ width: '100%' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
        </form>
      </div>
    </Flex>
  );

  return (
    <>
      <ListHeader
        itemCount={showDrafts ? draftCount : itemCount}
        actionComponents={isSearchOpen ? null : actionComponents}
        showDrafts={showDrafts}
        headingTitle={tenantContext?.libraryHeading || ''}
        categoryComponent={categoryComponent}
        filteringComponents={filteringComponents}
        mobileFilteringComponents={isSearchOpen ? mobileSearchBar : mobileFilteringComponents}
        searchString={q || undefined}
      />
      <MobileSortModal
        isOpen={isSortModalOpen}
        onDismiss={handleCloseSortModal}
        title="Sort"
        sections={sortSections}
        onApply={handleApplySort}
        onReset={handleResetSort}
      />
    </>
  );
};
