import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import debounce from 'debounce'
import { Select } from 'oa-components'
import { ResearchStatus } from 'oa-shared'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { Flex, Input } from 'theme-ui'

import { CategoriesSelectV2 } from '../../common/Category/CategoriesSelectV2'
import { listing } from '../labels'
import { ResearchSearchParams, researchService } from '../research.service'
import { ResearchSortOptions } from '../ResearchSortOptions'

import type { SelectValue } from '../../common/Category/CategoriesSelectV2'
import type { ResearchSortOption } from '../ResearchSortOptions'

const researchStatusOptions = [
  { label: 'All', value: '' },
  ...Object.values(ResearchStatus).map((x) => ({
    label: x.toString(),
    value: x.toString(),
  })),
]

export const ResearchFilterHeader = () => {
  const [categories, setCategories] = useState<SelectValue[]>([])
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryParam = searchParams.get(ResearchSearchParams.category)
  const category = categories?.find((x) => x.value === categoryParam) ?? null
  const q = searchParams.get(ResearchSearchParams.q)
  const sort = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption
  const status =
    (searchParams.get(ResearchSearchParams.status) as ResearchStatus) || ''

  // TODO: create a library component for this
  const _inputStyle = {
    width: ['100%', '100%', '200px'],
    mr: [0, 0, 2],
    mb: [3, 3, 0],
  }

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await researchService.getResearchCategories()) || []
      setCategories(
        categories.map((x) => {
          return { value: x._id, label: x.label }
        }),
      )
    }

    initCategories()
  }, [])

  const updateFilter = useCallback(
    (key: ResearchSearchParams, value: string) => {
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
      params.set(ResearchSearchParams.q, value)

      if (value.length > 0 && sort !== 'MostRelevant') {
        params.set(ResearchSearchParams.sort, 'MostRelevant')
      }

      if (value.length === 0 || !value) {
        params.set(ResearchSearchParams.sort, 'LatestUpdated')
      }

      setSearchParams(params)
    }, 1000),
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
      {/* Categories */}
      <Flex sx={_inputStyle}>
        <CategoriesSelectV2
          value={category}
          onChange={(updatedCategory) =>
            updateFilter(ResearchSearchParams.category, updatedCategory)
          }
          placeholder={listing.filterCategory}
          isForm={false}
          categories={categories}
        />
      </Flex>
      {/* Sort */}
      <Flex sx={_inputStyle}>
        <FieldContainer>
          <Select
            options={ResearchSortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={{ label: ResearchSortOptions.get(sort), value: sort }}
            onChange={(sortBy) =>
              updateFilter(ResearchSearchParams.sort, sortBy.value)
            }
          />
        </FieldContainer>
      </Flex>
      {/* Status filter */}
      <Flex sx={_inputStyle}>
        <FieldContainer>
          <Select
            options={researchStatusOptions}
            placeholder={listing.status}
            value={status ? { label: status, value: status } : undefined}
            onChange={(status) =>
              updateFilter(ResearchSearchParams.status, status.value)
            }
          />
        </FieldContainer>
      </Flex>
      {/* Text search */}
      <Flex sx={_inputStyle}>
        <Input
          variant="inputOutline"
          data-cy="research-search-box"
          defaultValue={q || ''}
          placeholder={listing.search}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
      </Flex>
    </Flex>
  )
}
