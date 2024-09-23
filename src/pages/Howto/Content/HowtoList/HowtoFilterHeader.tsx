import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import debounce from 'debounce'
import { SearchField, Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { Flex } from 'theme-ui'

import { CategoriesSelectV2 } from '../../../common/Category/CategoriesSelectV2'
import { howtoService, HowtosSearchParams } from '../../howto.service'
import { listing } from '../../labels'
import { HowtoSortOptions } from './HowtoSortOptions'

import type { SelectValue } from '../../../common/Category/CategoriesSelectV2'
import type { HowtoSortOption } from './HowtoSortOptions'

export const HowtoFilterHeader = () => {
  const [categories, setCategories] = useState<SelectValue[]>([])
  const [searchString, setSearchString] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(HowtosSearchParams.category)
  const category = categories?.find((x) => x.value === categoryParam) ?? null
  const q = searchParams.get(HowtosSearchParams.q)
  const sort = searchParams.get(HowtosSearchParams.sort) as HowtoSortOption

  const _inputStyle = {
    width: ['100%', '100%', '230px'],
    mr: [0, 0, 2],
    mb: [3, 3, 0],
  }

  useEffect(() => {
    if (q && q.length > 0) {
      setSearchString(q)
    }
  }, [q])

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
      searchValue(value)
    }, 500),
    [searchParams],
  )

  const searchValue = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(HowtosSearchParams.q, value)

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set(HowtosSearchParams.sort, 'MostRelevant')
    }

    if (value.length === 0 || !value) {
      params.set(HowtosSearchParams.sort, 'Newest')
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
        <SearchField
          dataCy="howtos-search-box"
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
