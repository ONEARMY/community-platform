import { useHistory } from 'react-router'
import type { RouteComponentProps } from 'react-router'
import { Flex, Input } from 'theme-ui'
import { useState } from 'react'
import { Select } from 'oa-components'

import { FieldContainer } from 'src/common/Form/FieldContainer'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'

import type { HowtoStore } from 'src/stores/Howto/howto.store'
import type { ResearchStore } from 'src/stores/Research/research.store'

import { capitalizeFirstLetter } from 'src/utils/helpers'
import { ItemSortingOption } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'

const updateQueryParams = (
  url: string,
  key: string,
  val: string,
  history: RouteComponentProps['history'],
) => {
  const newUrl = new URL(url)
  const urlParams = new URLSearchParams(newUrl.search)
  if (val) {
    urlParams.set(key, val)
  } else {
    urlParams.delete(key)
  }
  newUrl.search = urlParams.toString()

  const { pathname, search } = newUrl

  history.push({
    pathname,
    search,
  })
}

interface SortFilterHeaderProps {
  store: HowtoStore | ResearchStore
  type: 'how-to' | 'research'
}

export const SortFilterHeader = ({
  type,
  store: currentStore,
}: SortFilterHeaderProps) => {
  const history = useHistory()

  const { searchValue, activeSorter, availableItemSortingOption } = currentStore

  const sortingOptions = availableItemSortingOption
    ?.map((label) => ({
      label: label.replace(/([a-z])([A-Z])/g, '$1 $2'),
      value: label,
    }))
    .filter((option) => option.value !== activeSorter)

  const defaultSortingOption =
    Array.isArray(sortingOptions) && sortingOptions.length > 0
      ? sortingOptions.find(
          (sortingOption) => sortingOption.value == activeSorter,
        ) ?? sortingOptions[0]
      : ''

  const [sortState, setSortState] = useState(
    activeSorter === ItemSortingOption.Random ? '' : defaultSortingOption,
  )

  const _inputStyle = {
    width: ['100%', '100%', '240px'],
    mr: [0, 0, 2],
    mb: [3, 3, 0],
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
        <CategoriesSelect
          value={
            currentStore.selectedCategory
              ? { label: currentStore.selectedCategory }
              : null
          }
          onChange={(category) => {
            updateQueryParams(
              window.location.href,
              'category',
              category ? category.label : '',
              history,
            )
            currentStore.updateSelectedCategory(category ? category.label : '')
          }}
          placeholder="Filter by category"
          isForm={false}
          type={type.replace(/-/g, '')}
        />
      </Flex>
      <Flex sx={_inputStyle}>
        <FieldContainer>
          <Select
            options={sortingOptions}
            placeholder="Sort by"
            value={sortState}
            onChange={(sortBy) => {
              currentStore.updateActiveSorter(sortBy.value)
              setSortState(sortBy)
            }}
          />
        </FieldContainer>
      </Flex>
      <Flex sx={_inputStyle}>
        <Input
          variant="inputOutline"
          data-cy={`${type}-search-box`}
          value={searchValue}
          placeholder={`Search for a ${capitalizeFirstLetter(type)}`}
          onChange={(evt) => {
            const value = evt.target.value
            updateQueryParams(window.location.href, 'search', value, history)
            currentStore.updateSearchValue(value)
          }}
        />
      </Flex>
    </Flex>
  )
}
