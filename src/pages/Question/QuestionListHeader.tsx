import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import debounce from 'debounce';
import { CategoryHorizonalList, ReturnPathLink, SearchField, Select, Tooltip } from 'oa-components';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { UserAction } from 'src/common/UserAction';
import { categoryService } from 'src/services/categoryService';
import { Button, Flex } from 'theme-ui';

import DraftButton from '../common/Drafts/DraftButton';
import { ListHeader } from '../common/Layout/ListHeader';
import { headings, listing } from './labels';
import { QuestionSearchParams } from './question.service';
import { QuestionSortOptions } from './QuestionSortOptions';

import type { Category } from 'oa-shared';
import type { QuestionSortOption } from './QuestionSortOptions';

interface IProps {
  itemCount?: number
  draftCount: number
  handleShowDrafts: () => void
  showDrafts: boolean
}

export const QuestionListHeader = (props: IProps) => {
  const { itemCount, draftCount, handleShowDrafts, showDrafts } = props

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(QuestionSearchParams.q);
  const [searchString, setSearchString] = useState<string>(() => q ?? '');

  const categoryParam = searchParams.get(QuestionSearchParams.category);
  const category = (categoryParam && categories?.find((x) => x.id === +categoryParam)) ?? null;
  const sort = searchParams.get(QuestionSearchParams.sort) as QuestionSortOption;

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await categoryService.getCategories('questions')) || [];
      setCategories(categories);
    };

    initCategories();
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
      activeCategory={category !== '' ? category : null}
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
      }}
    >
      <Flex sx={{ width: ['100%', '100%', '230px'] }}>
        <FieldContainer>
          <Select
            options={QuestionSortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={{ label: QuestionSortOptions.get(sort) }}
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
      showDrafts={false}
      headingTitle={headings.list}
      categoryComponent={categoryComponent}
      filteringComponents={filteringComponents}
    />
  );
};
