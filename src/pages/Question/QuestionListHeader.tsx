import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import debounce from 'debounce'
import { CategoryVerticalList, SearchField, Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import {
  QuestionSearchParams,
  questionService,
} from 'src/pages/Question/question.service'
import { Button, Flex } from 'theme-ui'

import { ListHeader } from '../common/Layout/ListHeader'
import { headings, listing } from './labels'
import { QuestionSortOptions } from './QuestionSortOptions'

import type { ICategory } from 'oa-shared'
import type { Category } from 'src/models/category.model'
import type { QuestionSortOption } from './QuestionSortOptions'

export const QuestionListHeader = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchString, setSearchString] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(QuestionSearchParams.category)
  const category =
    (categoryParam && categories?.find((x) => x.id === +categoryParam)) ?? null
  const q = searchParams.get(QuestionSearchParams.q)
  const sort = searchParams.get(QuestionSearchParams.sort) as QuestionSortOption

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await questionService.getQuestionCategories()) || []
      setCategories(categories)
    }

    initCategories()
  }, [])

  useEffect(() => {
    setSearchString(q || '')
  }, [q])

  const updateFilter = useCallback(
    (key: QuestionSearchParams, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      setSearchParams(params)
    },
    [searchParams],
  )

  const onSearchInputChange = useCallback(
    debounce((value: string) => {
      searchValue(value)
    }, 500),
    [searchParams],
  )

  const searchValue = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', value)

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set('sort', 'MostRelevant')
    }

    if (value.length === 0 || !value) {
      params.set('sort', 'Newest')
    }

    setSearchParams(params)
  }

  const { userStore } = useCommonStores().stores

  const allCategories = categories.map(
    (x) => ({ _id: x.id, label: x.name }) as unknown as ICategory,
  )

  const activeCategory = category
    ? ({ _id: category.id, label: category.name } as unknown as ICategory)
    : null

  const actionComponents = (
    <Flex>
      <Link
        to={
          userStore.user
            ? '/questions/create'
            : '/sign-in?returnUrl=' + encodeURIComponent(location.pathname)
        }
      >
        <Button type="button" data-cy="create" variant="primary">
          {listing.create}
        </Button>
      </Link>
    </Flex>
  )

  const categoryComponent = (
    <CategoryVerticalList
      allCategories={allCategories}
      activeCategory={activeCategory}
      setActiveCategory={(updatedCategory) =>
        updateFilter(
          QuestionSearchParams.category,
          updatedCategory ? updatedCategory._id : '',
        )
      }
    />
  )

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
            onChange={(sortBy) =>
              updateFilter(QuestionSearchParams.sort, sortBy.value)
            }
          />
        </FieldContainer>
      </Flex>
      <Flex sx={{ width: ['100%', '100%', '300px'] }}>
        <SearchField
          dataCy="questions-search-box"
          placeHolder={listing.search}
          value={searchString}
          onChange={(value) => {
            setSearchString(value)
            onSearchInputChange(value)
          }}
          onClickDelete={() => {
            setSearchString('')
            searchValue('')
          }}
          onClickSearch={() => searchValue(searchString)}
        />
      </Flex>
    </Flex>
  )

  return (
    <ListHeader
      actionComponents={actionComponents}
      showDrafts={false}
      headingTitle={headings.list}
      categoryComponent={categoryComponent}
      filteringComponents={filteringComponents}
    />
  )
}
