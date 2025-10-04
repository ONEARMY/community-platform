import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import debounce from 'debounce'
import {
  CategoryHorizonalList,
  CombinedSearchSort,
  ReturnPathLink,
  SearchField,
  Select,
  Tooltip,
} from 'oa-components'
import { ResearchStatusRecord, UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { UserAction } from 'src/common/UserAction'
import { isPreciousPlastic } from 'src/config/config'
import DraftButton from 'src/pages/common/Drafts/DraftButton'
import { ListHeader } from 'src/pages/common/Layout/ListHeader'
import { categoryService } from 'src/services/categoryService'
import { Button, Flex } from 'theme-ui'

import { listing } from '../labels'
import { ResearchSortOptions } from '../ResearchSortOptions'
import { ResearchSearchParams } from './ResearchSearchParams'

import type { Category, ResearchStatus } from 'oa-shared'
import type { ResearchSortOption } from '../ResearchSortOptions'

interface IProps {
  draftCount: number
  handleShowDrafts: () => void
  showDrafts: boolean
}

const researchStatusOptions: { label: string; value: ResearchStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'complete' },
]

export const ResearchFilterHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props

  const [categories, setCategories] = useState<Category[]>([])
  const [searchString, setSearchString] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = Number(searchParams.get(ResearchSearchParams.category))
  const category = categories?.find((x) => x.id === categoryParam) ?? null
  const q = searchParams.get(ResearchSearchParams.q)
  const sort = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption
  const status =
    (searchParams.get(ResearchSearchParams.status) as ResearchStatus) || ''

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await categoryService.getCategories('research')) || []
      setCategories(categories)
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
      searchValue(value)
    }, 500),
    [searchParams],
  )

  const searchValue = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(ResearchSearchParams.q, value)

    if (value.length > 0 && sort !== 'MostRelevant') {
      params.set(ResearchSearchParams.sort, 'MostRelevant')
    }

    if (value.length === 0 || !value) {
      params.set(ResearchSearchParams.sort, 'LatestUpdated')
    }

    setSearchParams(params)
  }
  const roleRequired = isPreciousPlastic()
    ? undefined
    : [UserRole.ADMIN, UserRole.RESEARCH_CREATOR]
  const actionComponents = (
    <UserAction
      incompleteProfile={
        <AuthWrapper roleRequired={roleRequired}>
          <Link to="/settings">
            <Button
              type="button"
              variant="disabled"
              data-cy="complete-profile-research"
              data-tooltip-id="tooltip"
              data-tooltip-content={listing.incompleteProfile}
            >
              {listing.create}
            </Button>
          </Link>
          <Tooltip id="tooltip" />
        </AuthWrapper>
      }
      loggedIn={
        <AuthWrapper roleRequired={roleRequired}>
          <DraftButton
            showDrafts={showDrafts}
            draftCount={draftCount}
            handleShowDrafts={handleShowDrafts}
          />
          <Link to="/research/create">
            <Button type="button" variant="primary" data-cy="create">
              {listing.create}
            </Button>
          </Link>
        </AuthWrapper>
      }
      loggedOut={
        isPreciousPlastic() && (
          <ReturnPathLink to="/sign-up">
            <Button type="button" variant="primary" data-cy="sign-up">
              {listing.join}
            </Button>
          </ReturnPathLink>
        )
      }
    />
  )

  const categoryComponent = (
    <CategoryHorizonalList
      allCategories={categories}
      activeCategory={category}
      setActiveCategory={(updatedCategory) =>
        updateFilter(
          ResearchSearchParams.category,
          updatedCategory ? (updatedCategory as Category).id.toString() : '',
        )
      }
    />
  )

  const filteringComponents = (
    <Flex
      sx={{
        gap: 2,
        flexDirection: ['column', 'column', 'row'],
        flexWrap: 'wrap',
      }}
    >
      <Flex sx={{ display: ['flex', 'flex', 'none'] }}>
        <CombinedSearchSort
          sortOptions={ResearchSortOptions.toArray(!!q)}
          sortPlaceholder="Sort"
          sortValue={{ label: ResearchSortOptions.get(sort), value: sort }}
          onSortChange={(sortBy) =>
            updateFilter(ResearchSearchParams.sort, sortBy.value)
          }
          searchValue={searchString}
          searchPlaceholder="Search..."
          onSearchChange={(value) => {
            setSearchString(value)
            onSearchInputChange(value)
          }}
          onSearchDelete={() => {
            setSearchString('')
            searchValue('')
          }}
          onSearchSubmit={() => searchValue(searchString)}
          dataCy="research-mobile-search-sort"
        />
      </Flex>

      <Flex
        sx={{
          width: ['0px', '0px', '220px'],
          display: ['none', 'none', 'flex'],
        }}
      >
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

      <Flex
        sx={{
          width: ['0px', '0px', '220px'],
          display: ['none', 'none', 'flex'],
        }}
      >
        <FieldContainer>
          <Select
            options={researchStatusOptions}
            placeholder={listing.status}
            value={
              status
                ? { label: ResearchStatusRecord[status], value: status }
                : undefined
            }
            onChange={(status) =>
              updateFilter(ResearchSearchParams.status, status.value)
            }
          />
        </FieldContainer>
      </Flex>

      <Flex
        sx={{
          width: ['0px', '0px', '270px'],
          display: ['none', 'none', 'flex'],
        }}
      >
        <SearchField
          dataCy="research-search-box"
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

  return (
    <ListHeader
      actionComponents={actionComponents}
      showDrafts={showDrafts}
      headingTitle={listing.heading}
      categoryComponent={categoryComponent}
      filteringComponents={filteringComponents}
    />
  )
}
