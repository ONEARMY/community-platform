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
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { useClickOutside } from 'src/common/hooks/useClickOutside';
import { UserAction } from 'src/common/UserAction';
import type { FilterSection } from 'src/pages/common/Layout/MobileSortModal';
import { MobileSortModal } from 'src/pages/common/Layout/MobileSortModal';
import { categoryService } from 'src/services/categoryService';
import { Box, Button, Flex } from 'theme-ui';
import DraftButton from '../common/Drafts/DraftButton';
import { ListHeader } from '../common/Layout/ListHeader';
import { headings, listing } from './labels';
import type { QuestionSortOption } from './QuestionSortOptions';
import { QuestionSortOptions } from './QuestionSortOptions';
import { QuestionSearchParams } from './question.service';

interface IProps {
  itemCount?: number;
  draftCount?: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

const DEFAULT_SORT: QuestionSortOption = 'Newest';

export const QuestionListHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props;

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(QuestionSearchParams.q);
  const [searchString, setSearchString] = useState<string>(() => q ?? '');

  const categoryParam = Number(searchParams.get(QuestionSearchParams.category));
  const category: Category | null = categoryParam
    ? (categories?.find((x) => x.id === +categoryParam) ?? null)
    : null;
  const sort = searchParams.get(QuestionSearchParams.sort) as QuestionSortOption;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [pendingSort, setPendingSort] = useState<QuestionSortOption>(sort || DEFAULT_SORT);

  const handleOpenSortModal = () => {
    setPendingSort(sort || DEFAULT_SORT);
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
      const categories = (await categoryService.getCategories('questions')) || [];
      setCategories(categories);
    };

    initCategories();

    if (!searchParams.get(QuestionSearchParams.sort)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(QuestionSearchParams.sort, 'Newest');
      setSearchParams(params, { replace: true });
    }
  }, []);

  const updateFilter = useCallback(
    (key: QuestionSearchParams, value: string) => {
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
    params.set('q', value);

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set('sort', 'MostRelevant');
    }

    if (value.length === 0 || !value) {
      params.set('sort', 'Newest');
    }

    setSearchParams(params);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchValue(searchString);
    setIsSearchOpen(false);
  };

  const sortOptions = QuestionSortOptions.toArray(!!q);

  const effectiveDefaultSort = q ? 'MostRelevant' : DEFAULT_SORT;
  const activeFilterCount =
    (sort && sort !== effectiveDefaultSort ? 1 : 0) + (categoryParam > 0 ? 1 : 0);

  const handleApplySort = () => {
    updateFilter(QuestionSearchParams.sort, pendingSort);
    handleCloseSortModal();
  };

  const handleResetSort = () => {
    updateFilter(QuestionSearchParams.sort, DEFAULT_SORT);
    setPendingSort(DEFAULT_SORT);
  };

  const sortSections: FilterSection[] = [
    {
      title: 'Sort',
      options: sortOptions,
      selectedValue: pendingSort,
      onSelect: (value) => setPendingSort(value as QuestionSortOption),
    },
  ];

  const formRef = useClickOutside(() => {
    setIsSearchOpen(false);
  });

  const actionComponents = (
    <UserAction
      incompleteProfile={
        <>
          <Link
            to="/settings"
            data-tooltip-id="tooltip"
            data-tooltip-content={listing.incompleteProfile}
          >
            <Button type="button" data-cy="complete-profile-question" variant="disabled">
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
          <Link to="/questions/create">
            <Button type="button" data-cy="create-question" variant="primary">
              {listing.create}
            </Button>
          </Link>
        </>
      }
      loggedOut={
        <ReturnPathLink to="/sign-up">
          <Button type="button" data-cy="sign-up" variant="primary">
            {listing.join}
          </Button>
        </ReturnPathLink>
      }
    />
  );

  const categoryComponent = (
    <CategoryHorizonalList
      allCategories={categories}
      activeCategory={category}
      setActiveCategory={(updatedCategory) =>
        updateFilter(
          QuestionSearchParams.category,
          updatedCategory ? (updatedCategory as Category).id.toString() : '',
        )
      }
    />
  );

  const filteringComponents = (
    <Flex
      sx={{
        gap: 2,
        flexDirection: ['column', 'column', 'row'],
        flexWrap: 'wrap',
        display: ['none', 'flex', 'flex'],
      }}
    >
      <Flex sx={{ width: ['100%', '100%', '230px'] }}>
        <FieldContainer>
          <Select
            options={QuestionSortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={sort ? { label: QuestionSortOptions.get(sort), value: sort } : undefined}
            onChange={(sortBy) => updateFilter(QuestionSearchParams.sort, sortBy.value)}
          />
        </FieldContainer>
      </Flex>
      <Flex sx={{ width: ['100%', '100%', '300px'] }}>
        <SearchField
          dataCy="questions-search-box"
          placeHolder={listing.search}
          value={searchString}
          onChange={(value) => {
            setSearchString(value);
            onSearchInputChange(value);
          }}
          onClear={() => {
            setSearchString('');
            searchValue('');
          }}
          onClickSearch={() => searchValue(searchString)}
        />
      </Flex>
    </Flex>
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
            isExpanded
            autoFocus
            dataCy="questions-search-box"
            placeHolder={listing.search}
            value={searchString}
            onChange={(value) => {
              setSearchString(value);
              onSearchInputChange(value);
            }}
            onClear={() => {
              setSearchString('');
              searchValue('');
            }}
            onClickSearch={() => searchValue(searchString)}
            onBack={() => {
              setIsSearchOpen(false);
            }}
          />
        </form>
      </div>
    </Flex>
  );

  return (
    <>
      <ListHeader
        itemCount={(showDrafts ? draftCount : itemCount) || 0}
        actionComponents={isSearchOpen ? null : actionComponents}
        showDrafts={false}
        headingTitle={headings.list || ''}
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
