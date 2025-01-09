import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import debounce from 'debounce'
import { CategoryVerticalList, SearchField, Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import DraftButton from 'src/pages/common/Drafts/DraftButton'
import { ListHeader } from 'src/pages/common/Layout/ListHeader'
import { Button, Flex } from 'theme-ui'

import { listing } from '../../labels'
import { LibrarySearchParams, libraryService } from '../../library.service'
import { LibrarySortOptions } from './LibrarySortOptions'

import type { ICategory } from 'shared/lib'
import type { LibrarySortOption } from './LibrarySortOptions'

interface IProps {
  draftCount: number
  handleShowDrafts: () => void
  showDrafts: boolean
}

export const LibraryListHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props
  const [categories, setCategories] = useState<ICategory[]>([])
  const [searchString, setSearchString] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(LibrarySearchParams.category)
  const category = categories?.find((cat) => cat._id === categoryParam) ?? null
  const q = searchParams.get(LibrarySearchParams.q)
  const sort = searchParams.get(LibrarySearchParams.sort) as LibrarySortOption

  const headingTitle = import.meta.env.VITE_HOWTOS_HEADING
  const isUserLoggedIn = useCommonStores().stores.userStore?.user

  useEffect(() => {
    if (q && q.length > 0) {
      setSearchString(q)
    }
  }, [q])

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await libraryService.getLibraryCategories()) || []
      const notDeletedCategories = categories.filter(
        ({ _deleted }) => _deleted === false,
      )
      setCategories(notDeletedCategories)
    }

    initCategories()
  }, [])

  const updateFilter = useCallback(
    (key: LibrarySearchParams, value: string) => {
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
    params.set(LibrarySearchParams.q, value)

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set(LibrarySearchParams.sort, 'MostRelevant')
    }

    if (value.length === 0 || !value) {
      params.set(LibrarySearchParams.sort, 'Newest')
    }

    setSearchParams(params)
  }

  const categoryComponent = (
    <CategoryVerticalList
      allCategories={categories}
      activeCategory={category}
      setActiveCategory={(updatedCategory) =>
        updateFilter(
          LibrarySearchParams.category,
          updatedCategory ? updatedCategory._id : '',
        )
      }
    />
  )

  const filteringComponents = (
    <Flex sx={{ gap: 2, flexDirection: ['column', 'row', 'row'] }}>
      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
        <FieldContainer>
          <Select
            options={LibrarySortOptions.toArray(!!q)}
            placeholder={listing.sort}
            value={{
              label: LibrarySortOptions.get(sort),
              value: sort,
            }}
            onChange={(sortBy) =>
              updateFilter(LibrarySearchParams.sort, sortBy.value)
            }
          />
        </FieldContainer>
      </Flex>
      <Flex sx={{ width: ['100%', '100%', '270px'] }}>
        <SearchField
          dataCy="library-search-box"
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

  const actionComponents = (
    <>
      {isUserLoggedIn && (
        <DraftButton
          showDrafts={showDrafts}
          draftCount={draftCount}
          handleShowDrafts={handleShowDrafts}
        />
      )}
      <Link to={isUserLoggedIn ? '/library/create' : '/sign-up'}>
        <Button
          type="button"
          sx={{ width: '100%' }}
          variant="primary"
          data-cy="create"
        >
          {listing.create}
        </Button>
      </Link>
    </>
  )

  return (
    <ListHeader
      actionComponents={actionComponents}
      showDrafts={showDrafts}
      headingTitle={headingTitle}
      categoryComponent={categoryComponent}
      filteringComponents={filteringComponents}
    />
  )
}
