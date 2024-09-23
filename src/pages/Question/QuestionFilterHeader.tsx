import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import debounce from 'debounce'
import { SearchField, Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import {
  QuestionSearchParams,
  questionService,
} from 'src/pages/Question/question.service'
import { Flex } from 'theme-ui'

import { CategoriesSelectV2 } from '../common/Category/CategoriesSelectV2'
import { listing } from './labels'
import { QuestionSortOptions } from './QuestionSortOptions'

import type { SelectValue } from '../common/Category/CategoriesSelectV2'
import type { QuestionSortOption } from './QuestionSortOptions'

export const QuestionFilterHeader = () => {
  const [categories, setCategories] = useState<SelectValue[]>([])
  const [searchString, setSearchString] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(QuestionSearchParams.category)
  const category = categories?.find((x) => x.value === categoryParam) ?? null
  const q = searchParams.get(QuestionSearchParams.q)
  const sort = searchParams.get(QuestionSearchParams.sort) as QuestionSortOption

  const _inputStyle = {
    width: ['100%', '100%', '230px'],
    mr: [0, 0, 2],
    mb: [3, 3, 0],
  }

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await questionService.getQuestionCategories()) || []
      setCategories(
        categories.map((x) => {
          return { value: x._id, label: x.label }
        }),
      )
    }

    initCategories()
  }, [])

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

  return (
    <Flex
      sx={{
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        flexDirection: ['column', 'column', 'row'],
        mb: 3,
      }}
    >
      <Flex sx={_inputStyle}>
        <CategoriesSelectV2
          value={category}
          onChange={(updatedCategory) =>
            updateFilter(QuestionSearchParams.category, updatedCategory)
          }
          placeholder={listing.filterCategory}
          isForm={false}
          categories={categories}
        />
      </Flex>
      <Flex sx={_inputStyle}>
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
      <Flex sx={_inputStyle}>
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
}
