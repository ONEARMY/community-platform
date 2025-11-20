import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import debounce from 'debounce';
import { CategoryHorizonalList, ReturnPathLink, SearchField, Select, Tooltip } from 'oa-components';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { UserAction } from 'src/common/UserAction';
import DraftButton from 'src/pages/common/Drafts/DraftButton';
import { ListHeader } from 'src/pages/common/Layout/ListHeader';
import { categoryService } from 'src/services/categoryService';
import { Button, Flex } from 'theme-ui';

import { listing } from '../../labels';
import { LibrarySearchParams } from '../../library.service';
import { LibrarySortOptions } from './LibrarySortOptions';

import type { Category } from 'oa-shared';
import type { LibrarySortOption } from './LibrarySortOptions';

interface IProps {
  itemCount?: number
  draftCount: number
  handleShowDrafts: () => void
  showDrafts: boolean
}

export const LibraryListHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props
  const [categories, setCategories] = useState<Category[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get(LibrarySearchParams.q)
  const [searchString, setSearchString] = useState<string>(q ?? '')

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
      params.set(LibrarySearchParams.sort, 'Newest');
    }

    setSearchParams(params);
  };

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
    <Flex sx={{ gap: 2, flexDirection: ['column', 'row', 'row'] }}>
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

  return (
    <ListHeader
      itemCount={showDrafts ? draftCount : itemCount}
      actionComponents={actionComponents}
      showDrafts={showDrafts}
      headingTitle={headingTitle}
      categoryComponent={categoryComponent}
      filteringComponents={filteringComponents}
    />
  );
};
