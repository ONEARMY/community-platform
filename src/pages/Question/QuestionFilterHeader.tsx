import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import debounce from 'debounce'
import { Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { Flex, Input } from 'theme-ui'

import { CategoriesSelectV2 } from '../common/Category/CategoriesSelectV2'
import { listing } from './labels'
import { questionService } from './question.service'
import { QuestionSortOptions } from './QuestionSortOptions'

import type { SelectValue } from '../common/Category/CategoriesSelectV2'

type QuestionSearchParams = 'category' | 'q' | 'sort'

export const QuestionFilterHeader = () => {
  const [categories, setCategories] = useState<SelectValue[]>([])

  const [searchParams, setSearchParams] = useSearchParams()
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

      if (value.length > 0 && sort !== QuestionSortOptions.MostRelevant) {
        params.set('sort', QuestionSortOptions.MostRelevant)
      }

      if (value.length === 0 || !value) {
        params.set('sort', QuestionSortOptions.Newest)
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
          placeholder={listing.filterCategory}
          isForm={false}
          categories={categories}
        />
      </Flex>
      <Flex sx={_inputStyle}>
        <FieldContainer>
          <Select
            options={Object.values(QuestionSortOptions).map((x) => ({
              label: x.toString(),
              value: x.toString(),
            }))}
            placeholder={listing.sort}
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
          placeholder={listing.search}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
      </Flex>
    </Flex>
  )
}
