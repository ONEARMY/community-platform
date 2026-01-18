import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import debounce from 'debounce';
import { CategoryHorizonalList, ReturnPathLink, SearchField, Select, Tooltip } from 'oa-components';
import { ResearchStatusRecord, UserRole } from 'oa-shared';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { UserAction } from 'src/common/UserAction';
import { isPreciousPlastic } from 'src/config/config';
import DraftButton from 'src/pages/common/Drafts/DraftButton';
import { ListHeader } from 'src/pages/common/Layout/ListHeader';
import { categoryService } from 'src/services/categoryService';
import { Button, Flex } from 'theme-ui';

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
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'complete' },
];

export const ResearchFilterHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props;

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(ResearchSearchParams.q);
  const [searchString, setSearchString] = useState<string>(q ?? '');

  const categoryParam = Number(searchParams.get(ResearchSearchParams.category));
  const category = categories?.find((x) => x.id === categoryParam) ?? null;
  const sortParam = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption | null;
  const status = (searchParams.get(ResearchSearchParams.status) as ResearchStatus) || '';
  
  // Compute default sort value immediately using useMemo to avoid race condition
  // This ensures the dropdown always has a value, even before URL is updated
  const defaultSort = useMemo<ResearchSortOption>(() => {
    return q ? 'MostRelevant' : 'LatestUpdated';
  }, [q]);
  
  // Use sortParam if available, otherwise fall back to defaultSort
  // This ensures sort is always defined synchronously, preventing empty dropdown
  const sort = sortParam || defaultSort;

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
      params.set(ResearchSearchParams.sort, 'LatestUpdated');
    }

    setSearchParams(params);
  };
  const roleRequired = isPreciousPlastic()
    ? undefined
    : [UserRole.ADMIN, UserRole.RESEARCH_CREATOR];
  const actionComponents = (
    <UserAction
      incompleteProfile={
        <AuthWrapper roleRequired={roleRequired}>
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
        <AuthWrapper roleRequired={roleRequired}>
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
  );

  return (
    <ListHeader
      itemCount={showDrafts ? draftCount : itemCount}
      actionComponents={actionComponents}
      showDrafts={showDrafts}
      headingTitle={listing.heading}
      categoryComponent={categoryComponent}
      filteringComponents={filteringComponents}
    />
  );
};
