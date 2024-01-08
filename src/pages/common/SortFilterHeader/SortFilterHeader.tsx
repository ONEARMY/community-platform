import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { ItemSortingOption } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'
import { capitalizeFirstLetter, getAuthorOptions } from 'src/utils/helpers'
import { Flex, Input } from 'theme-ui'

import type { NavigateFunction } from 'react-router-dom'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import type { QuestionStore } from 'src/stores/Question/question.store'
import type { ResearchStore } from 'src/stores/Research/research.store'

const updateQueryParams = (
  url: string,
  key: string,
  val: string,
  navigate: NavigateFunction,
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

  navigate({ pathname, search })
}

const getQueryParam = (
  url: string,
  key: string,
  defaultValue: string | null,
) => {
  const Url = new URL(url)
  const params = new URLSearchParams(Url.search)
  return params.get(key) ?? defaultValue
}

interface SortFilterHeaderProps {
  store: HowtoStore | ResearchStore | QuestionStore
  type: 'how-to' | 'research' | 'question'
}

export const SortFilterHeader = ({
  type,
  store: currentStore,
}: SortFilterHeaderProps) => {
  const navigate = useNavigate()

  const { searchValue, activeSorter, availableItemSortingOption } = currentStore

  const allSortingOptions = availableItemSortingOption?.map((label) => ({
    label: label.replace(/([a-z])([A-Z])/g, '$1 $2'),
    value: label,
  }))

  const dropdownSortingOptions = availableItemSortingOption
    ?.map((label) => ({
      label: label.replace(/([a-z])([A-Z])/g, '$1 $2'),
      value: label,
    }))
    .filter((option) => option.value !== activeSorter)

  const defaultSortingOption =
    Array.isArray(allSortingOptions) && allSortingOptions.length > 0
      ? allSortingOptions.find(
          (sortingOption) => sortingOption.value == activeSorter,
        ) ?? dropdownSortingOptions[0]
      : ''

  const [sortState, setSortState] = useState(
    activeSorter === ItemSortingOption.Random ? '' : defaultSortingOption,
  )

  const items =
    type == 'how-to'
      ? (currentStore as HowtoStore).filteredHowtos
      : type == 'research'
      ? (currentStore as ResearchStore).filteredResearches
      : (currentStore as QuestionStore).filteredQuestions

  const urlSelectedAuthor = getQueryParam(window.location.href, 'author', null)
  if (urlSelectedAuthor && 'updateSelectedAuthor' in currentStore)
    currentStore.updateSelectedAuthor(urlSelectedAuthor)

  const _inputStyle = {
    width: ['100%', '100%', '200px'],
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
              navigate,
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
            options={dropdownSortingOptions}
            placeholder="Sort by"
            value={sortState}
            onChange={(sortBy) => {
              currentStore.updateActiveSorter(sortBy.value)
              setSortState(sortBy)
            }}
          />
        </FieldContainer>
      </Flex>
      {'selectedAuthor' in currentStore && (
        <Flex sx={_inputStyle}>
          <FieldContainer>
            <Select
              options={getAuthorOptions(items)}
              placeholder="Filter by author"
              value={
                currentStore.selectedAuthor
                  ? {
                      label: currentStore.selectedAuthor,
                      value: currentStore.selectedAuthor,
                    }
                  : null
              }
              onChange={(author) => {
                updateQueryParams(
                  window.location.href,
                  'author',
                  author ? author.value : '',
                  navigate,
                )
                currentStore.updateSelectedAuthor(author?.value ?? null)
              }}
              isClearable={true}
            />
          </FieldContainer>
        </Flex>
      )}
      <Flex sx={_inputStyle}>
        <Input
          variant="inputOutline"
          data-cy={`${type}-search-box`}
          value={searchValue}
          placeholder={`Search for a ${capitalizeFirstLetter(type)}`}
          onChange={(evt) => {
            const value = evt.target.value
            updateQueryParams(window.location.href, 'search', value, navigate)
            currentStore.updateSearchValue(value)
            if (
              value.length > 0 &&
              currentStore.activeSorter !== ItemSortingOption.MostRelevant
            ) {
              currentStore.updateActiveSorter(ItemSortingOption.MostRelevant)
              setSortState({ label: 'Most Relevant', value: 'MostRelevant' })
            }

            if (value.length === 0 || !value) {
              currentStore.updateActiveSorter(
                currentStore.availableItemSortingOption[0],
              )
              setSortState(defaultSortingOption)
            }
          }}
        />
      </Flex>
    </Flex>
  )
}
