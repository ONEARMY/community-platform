import debounce from 'debounce';
import {
  ButtonIcon,
  CategoryHorizonalList,
  ReturnPathLink,
  SearchField,
  Select,
  Tooltip,
} from 'oa-components';
import type { Category, ResearchStatus } from 'oa-shared';
import { ResearchStatusRecord } from 'oa-shared';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AuthWrapper } from 'src/common/AuthWrapper';
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
import { listing } from '../labels';
import type { ResearchSortOption } from '../ResearchSortOptions';
import { ResearchSortOptions } from '../ResearchSortOptions';
import { ResearchSearchParams } from './ResearchSearchParams';

interface IProps {
  itemCount?: number;
  draftCount?: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

const researchStatusOptions: { label: string; value: ResearchStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'complete' },
];

const DEFAULT_SORT: ResearchSortOption = 'LatestUpdated';

export const ResearchFilterHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props;

  const tenantContext = useContext(TenantContext);

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(ResearchSearchParams.q);
  const [searchString, setSearchString] = useState<string>(q ?? '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const sort = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption;
  const status = (searchParams.get(ResearchSearchParams.status) as ResearchStatus) || '';
  const categoryParam = Number(searchParams.get(ResearchSearchParams.category));
  const category = categories?.find((x) => x.id === categoryParam) ?? null;

  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [pendingSort, setPendingSort] = useState<ResearchSortOption>(sort || DEFAULT_SORT);
  const [pendingStatus, setPendingStatus] = useState<ResearchStatus | ''>(status || '');

  const handleApplySort = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (pendingSort) {
      params.set(ResearchSearchParams.sort, pendingSort);
    } else {
      params.delete(ResearchSearchParams.sort);
    }
    if (pendingStatus) {
      params.set(ResearchSearchParams.status, pendingStatus);
    } else {
      params.delete(ResearchSearchParams.status);
    }
    setSearchParams(params);
    handleCloseSortModal();
  };

  const handleResetSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(ResearchSearchParams.sort, DEFAULT_SORT);
    params.delete(ResearchSearchParams.status);
    setSearchParams(params);
    setPendingSort(DEFAULT_SORT);
    setPendingStatus('');
  };

  const sortOptions = ResearchSortOptions.toArray(!!q);

  const handleOpenSortModal = () => {
    setPendingSort(sort || DEFAULT_SORT);
    setPendingStatus(status || '');
    setIsSortModalOpen(true);
  };

  const handleCloseSortModal = () => {
    setIsSortModalOpen(false);
  };

  const handleToggleSearchOpen = () => {
    setIsSearchOpen((x) => !x);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchValue(searchString);
    setIsSearchOpen(false);
  };

  const formRef = useClickOutside(() => {
    setIsSearchOpen(false);
  });

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await categoryService.getCategories('research')) || [];
      setCategories(categories);
    };

    initCategories();

    if (!searchParams.get(ResearchSearchParams.sort)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(ResearchSearchParams.sort, 'LatestUpdated');
      setSearchParams(params, { replace: true });
    }
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
    params.set(ResearchSearchParams.q, value);

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set(ResearchSearchParams.sort, 'MostRelevant');
    }

    if (value.length === 0 || !value) {
      params.set(ResearchSearchParams.sort, DEFAULT_SORT);
    }

    setSearchParams(params);
  };

  const effectiveDefaultSort = q ? 'MostRelevant' : DEFAULT_SORT;
  const activeFilterCount =
    (sort && sort !== effectiveDefaultSort ? 1 : 0) +
    (categoryParam > 0 ? 1 : 0) +
    (status ? 1 : 0);

  const createResearchRoles = tenantContext?.createResearchRoles;

  const actionComponents = (
    <UserAction
      incompleteProfile={
        <AuthWrapper roleRequired={tenantContext?.createResearchRoles}>
          <Link to="/settings">
            <Button
              type="button"
              variant="disabled"
              data-cy="complete-profile-research"
              data-tooltip-id="tooltip"
              data-tooltip-content={listing.incompleteProfile}
            >
              {listing.create}
            </Button>
          </Link>
          <Tooltip id="tooltip" />
        </AuthWrapper>
      }
      loggedIn={
        <AuthWrapper roleRequired={createResearchRoles}>
          <DraftButton
            showDrafts={showDrafts}
            draftCount={draftCount}
            handleShowDrafts={handleShowDrafts}
          />
          <Link to="/research/create">
            <Button type="button" variant="primary" data-cy="create">
              {listing.create}
            </Button>
          </Link>
        </AuthWrapper>
      }
      loggedOut={
        (!createResearchRoles ||
          (Array.isArray(createResearchRoles) && createResearchRoles.length === 0)) && (
          <ReturnPathLink to="/sign-up">
            <Button type="button" variant="primary" data-cy="sign-up">
              {listing.join}
            </Button>
          </ReturnPathLink>
        )
      }
    />
  );

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

  const filteringComponents = (
    <Flex
      sx={{
        gap: 2,
        flexDirection: ['column', 'column', 'row'],
        flexWrap: 'wrap',
        display: ['none', 'flex', 'flex'],
      }}
    >
      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
        <FieldContainer>
          <Select
            options={ResearchSortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={sort ? { label: ResearchSortOptions.get(sort), value: sort } : undefined}
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
  );

  const modalSections: FilterSection[] = [
    {
      title: 'Status',
      options: researchStatusOptions,
      selectedValue: pendingStatus,
      onSelect: (value) => setPendingStatus(value as ResearchStatus | ''),
    },
    {
      title: 'Sort',
      options: sortOptions,
      selectedValue: pendingSort,
      onSelect: (value) => setPendingSort(value as ResearchSortOption),
    },
  ];

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
        itemCount={showDrafts ? draftCount : itemCount}
        actionComponents={isSearchOpen ? null : actionComponents}
        showDrafts={showDrafts}
        headingTitle={listing.heading}
        categoryComponent={categoryComponent}
        filteringComponents={filteringComponents}
        mobileFilteringComponents={isSearchOpen ? mobileSearchBar : mobileFilteringComponents}
        searchString={q || undefined}
      />
      <MobileSortModal
        isOpen={isSortModalOpen}
        onDismiss={handleCloseSortModal}
        title="Filter and sort"
        sections={modalSections}
        onApply={handleApplySort}
        onReset={handleResetSort}
      />
    </>
  );
};
