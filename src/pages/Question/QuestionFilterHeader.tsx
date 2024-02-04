import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import debounce from 'debounce'
import { Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { ItemSortingOption } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'
import { Flex, Input } from 'theme-ui'

import { CategoriesSelectV2 } from '../common/Category/CategoriesSelectV2'
import { questionService } from './question.service'

import type { SelectValue } from '../common/Category/CategoriesSelectV2'

type QuestionSearchParams = 'category' | 'q' | 'sort'

export const QuestionFilterHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<SelectValue[]>([])
  const categoryParam = searchParams.get('category')
  const category = categories?.find((x) => x.value === categoryParam) ?? null
  const q = searchParams.get('q')
  const sort = searchParams.get('sort')
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
      params.set(key, value)
      setSearchParams(params)
    },
    [searchParams],
  )

  const onSearchInputChange = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('q', value)

      if (value.length > 0 && sort !== ItemSortingOption.MostRelevant) {
        params.set('sort', ItemSortingOption.MostRelevant)
      }

      if (value.length === 0 || !value) {
        params.set('sort', ItemSortingOption.Newest)
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
            updateFilter('category', updatedCategory)
          }
          placeholder="Filter by category"
          isForm={false}
          options={categories}
        />
      </Flex>
      <Flex sx={_inputStyle}>
        <FieldContainer>
          <Select
            options={Object.values(ItemSortingOption).map((x) => ({
              label: x.toString(),
              value: x.toString(),
            }))}
            placeholder="Sort by"
            value={{ label: sort, value: sort }}
            onChange={(sortBy) => updateFilter('sort', sortBy.label)}
          />
        </FieldContainer>
      </Flex>
      <Flex sx={_inputStyle}>
        <Input
          variant="inputOutline"
          data-cy="questions-search-box"
          defaultValue={q || ''}
          placeholder="Search for a question"
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
      </Flex>
    </Flex>
  )
}
