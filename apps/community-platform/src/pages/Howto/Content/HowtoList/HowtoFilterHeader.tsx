import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Select } from '@onearmy.apps/components'
import debounce from 'debounce'
import { Flex, Input } from 'theme-ui'

import { FieldContainer } from '../../../../common/Form/FieldContainer'
import { CategoriesSelectV2 } from '../../../common/Category/CategoriesSelectV2'
import { howtoService, HowtosSearchParams } from '../../howto.service'
import { listing } from '../../labels'
import { HowtoSortOptions } from './HowtoSortOptions'

import type { SelectValue } from '../../../common/Category/CategoriesSelectV2'
import type { HowtoSortOption } from './HowtoSortOptions'

export const HowtoFilterHeader = () => {
  const [categories, setCategories] = useState<SelectValue[]>([])

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(HowtosSearchParams.category)
  const category = categories?.find((x) => x.value === categoryParam) ?? null
  const q = searchParams.get(HowtosSearchParams.q)
  const sort = searchParams.get(HowtosSearchParams.sort) as HowtoSortOption

  const _inputStyle = {
    width: ['100%', '100%', '200px'],
    mr: [0, 0, 2],
    mb: [3, 3, 0],
  }

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await howtoService.getHowtoCategories()) || []
      setCategories(
        categories.map((x) => ({
          value: x._id,
          label: x.label,
        })),
      )
    }

    initCategories()
  }, [])

  const updateFilter = useCallback(
    (key: HowtosSearchParams, value: string) => {
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
      params.set(HowtosSearchParams.q, value)

      if (value.length > 0 && sort !== 'MostRelevant') {
        params.set(HowtosSearchParams.sort, 'MostRelevant')
      }

      if (value.length === 0 || !value) {
        params.set(HowtosSearchParams.sort, 'Newest')
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
            updateFilter(HowtosSearchParams.category, updatedCategory)
          }
          placeholder={listing.filterCategory}
          isForm={false}
          categories={categories}
        />
      </Flex>
      <Flex sx={_inputStyle}>
        <FieldContainer>
          <Select
            options={HowtoSortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={{
              label: HowtoSortOptions.get(sort),
              value: sort,
            }}
            onChange={(sortBy) =>
              updateFilter(HowtosSearchParams.sort, sortBy.value)
            }
          />
        </FieldContainer>
      </Flex>
      <Flex sx={_inputStyle}>
        <Input
          variant="inputOutline"
          data-cy="howtos-search-box"
          defaultValue={q || ''}
          placeholder={listing.search}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
      </Flex>
    </Flex>
  )
}
