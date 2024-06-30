import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Select } from '@onearmy.apps/components'
import debounce from 'debounce'
import { Flex, Input } from 'theme-ui'

import { FieldContainer } from '../../common/Form/FieldContainer'
import {
  QuestionSearchParams,
  questionService,
} from '../../pages/Question/question.service'
import { CategoriesSelectV2 } from '../common/Category/CategoriesSelectV2'
import { listing } from './labels'
import { QuestionSortOptions } from './QuestionSortOptions'

import type { SelectValue } from '../common/Category/CategoriesSelectV2'
import type { QuestionSortOption } from './QuestionSortOptions'

export const QuestionFilterHeader = () => {
  const [categories, setCategories] = useState<SelectValue[]>([])

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(QuestionSearchParams.category)
  const category = categories?.find((x) => x.value === categoryParam) ?? null
  const q = searchParams.get(QuestionSearchParams.q)
  const sort = searchParams.get(QuestionSearchParams.sort) as QuestionSortOption

  const _inputStyle = {
    width: ['100%', '100%', '200px'],
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
      const params = new URLSearchParams(searchParams.toString())
      params.set('q', value)

      if (value.length > 0 && sort !== 'MostRelevant') {
        params.set('sort', 'MostRelevant')
      }

      if (value.length === 0 || !value) {
        params.set('sort', 'Newest')
      }

      setSearchParams(params)
    }, 500),
    [searchParams],
  )

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
        <Input
          variant="inputOutline"
          data-cy="questions-search-box"
          defaultValue={q || ''}
          placeholder={listing.search}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
      </Flex>
    </Flex>
  )
}
