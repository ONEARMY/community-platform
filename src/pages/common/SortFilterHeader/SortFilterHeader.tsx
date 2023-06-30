import { useHistory } from 'react-router'
import type { RouteComponentProps } from 'react-router'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { Flex, Input } from 'theme-ui'
import { useState } from 'react'
import { Select } from 'oa-components'

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
export const SortFilterHeader = (props) => {
  const currentStore = props.store
  const type = props.type
  const history = useHistory()

  const sortingOptions = currentStore.availableItemSortingOption?.map(
    (label) => ({
      label: label.replace(/([a-z])([A-Z])/g, '$1 $2'),
      value: label,
    }),
  )
  /* eslint-disable no-console */
  console.log(type)

  const [sortState, setSortState] = useState('')
  const { searchValue } = currentStore

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
              currentStore.updateActiveSorter(String(sortBy.value))
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
          placeholder={`Search for a ${(
            type.charAt(0).toUpperCase() + type.slice(1)
          ).split('-')}`}
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
