import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import debounce from 'debounce'
import { CategoryVerticalList, SearchField, Select } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import DraftButton from 'src/pages/common/Drafts/DraftButton'
import { Button, Flex, Heading } from 'theme-ui'

import { howtoService, HowtosSearchParams } from '../../howto.service'
import { listing } from '../../labels'
import { HowtoSortOptions } from './HowtoSortOptions'

import type { ICategory } from 'shared/lib'
import type { HowtoSortOption } from './HowtoSortOptions'

interface IProps {
  draftCount: number
  handleShowDrafts: () => void
  showDrafts: boolean
}

export const HowtoFilterHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props
  const [categories, setCategories] = useState<ICategory[]>([])
  const [searchString, setSearchString] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(HowtosSearchParams.category)
  const category = categories?.find((cat) => cat._id === categoryParam) ?? null
  const q = searchParams.get(HowtosSearchParams.q)
  const sort = searchParams.get(HowtosSearchParams.sort) as HowtoSortOption

  const headingTitle = import.meta.env.VITE_HOWTOS_HEADING
  const isUserLoggedIn = useCommonStores().stores.userStore?.user

  useEffect(() => {
    if (q && q.length > 0) {
      setSearchString(q)
    }
  }, [q])

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await howtoService.getHowtoCategories()) || []
      const notDeletedCategories = categories.filter(
        ({ _deleted }) => _deleted === false,
      )
      setCategories(notDeletedCategories)
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
    <>
      <Flex
        sx={{
          paddingTop: [6, 12],
          paddingBottom: [4, 8],
          flexDirection: 'column',
          gap: [4, 8],
        }}
      >
        <Heading
          as="h1"
          sx={{
            marginX: 'auto',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 5,
          }}
        >
          {headingTitle}
        </Heading>
        <Flex sx={{ justifyContent: 'center' }}>
          <CategoryVerticalList
            allCategories={categories}
            activeCategory={category}
            setActiveCategory={(updatedCategory) =>
              updateFilter(
                HowtosSearchParams.category,
                updatedCategory ? updatedCategory._id : '',
              )
            }
          />
        </Flex>
      </Flex>

      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
          gap: 2,
        }}
      >
        {!showDrafts ? (
          <Flex sx={{ gap: 2, flexDirection: ['column', 'row', 'row'] }}>
            <Flex sx={{ width: ['100%', '100%', '220px'] }}>
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
            <Flex sx={{ width: ['100%', '100%', '270px'] }}>
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
        ) : (
          <div></div>
        )}

        <Flex sx={{ gap: 2, alignContent: 'flex-end', alignSelf: 'flex-end' }}>
          {isUserLoggedIn && (
            <DraftButton
              showDrafts={showDrafts}
              draftCount={draftCount}
              handleShowDrafts={handleShowDrafts}
            />
          )}
          <Link to={isUserLoggedIn ? '/how-to/create' : '/sign-up'}>
            <Button
              type="button"
              sx={{ width: '100%' }}
              variant="primary"
              data-cy="create"
            >
              {listing.create}
            </Button>
          </Link>
        </Flex>
      </Flex>
    </>
  )
}
