import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from '@remix-run/react'
import debounce from 'debounce'
import { CategoryVerticalList, SearchField, Select } from 'oa-components'
import { ResearchStatus } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { UserAction } from 'src/common/UserAction'
import { isPreciousPlastic } from 'src/config/config'
import DraftButton from 'src/pages/common/Drafts/DraftButton'
import { ListHeader } from 'src/pages/common/Layout/ListHeader'
import { Button, Flex } from 'theme-ui'

import { RESEARCH_EDITOR_ROLES } from '../constants'
import { listing } from '../labels'
import { researchService } from '../research.service'
import { ResearchSortOptions } from '../ResearchSortOptions'
import { ResearchSearchParams } from './ResearchSearchParams'

import type { ICategory } from 'oa-shared'
import type { ResearchSortOption } from '../ResearchSortOptions'

interface IProps {
  draftCount: number
  handleShowDrafts: () => void
  showDrafts: boolean
}

const researchStatusOptions = [
  { label: 'All', value: '' },
  ...Object.values(ResearchStatus).map((x) => ({
    label: x.toString(),
    value: x.toString(),
  })),
]

export const ResearchFilterHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props

  const [categories, setCategories] = useState<ICategory[]>([])
  const [searchString, setSearchString] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get(ResearchSearchParams.category)
  const category = categories?.find((x) => x._id === categoryParam) ?? null
  const q = searchParams.get(ResearchSearchParams.q)
  const sort = searchParams.get(ResearchSearchParams.sort) as ResearchSortOption
  const status =
    (searchParams.get(ResearchSearchParams.status) as ResearchStatus) || ''

  useEffect(() => {
    const initCategories = async () => {
      const categories = (await researchService.getResearchCategories()) || []
      const notDeletedCategories = categories.filter(
        ({ _deleted }) => _deleted === false,
      )
      setCategories(notDeletedCategories)
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

  const actionComponents = (
    <UserAction
      loggedIn={
        <AuthWrapper
          roleRequired={isPreciousPlastic() ? undefined : RESEARCH_EDITOR_ROLES}
        >
          <DraftButton
            showDrafts={showDrafts}
            draftCount={draftCount}
            handleShowDrafts={handleShowDrafts}
          />
        <Link to={isUserLoggedIn ? '/research/create' : '/sign-in'}>
            <Button type="button" variant="primary" data-cy="create">
              {listing.create}
            </Button>
          </>
        </AuthWrapper>
      }
      loggedOut={
        isPreciousPlastic() && (
          <Link to="/sign-up">
            <Button type="button" variant="primary" data-cy="sign-up">
              {listing.join}
            </Button>
          </Link>
        )
      }
    />
  )

  const categoryComponent = (
    <CategoryVerticalList
      allCategories={categories}
      activeCategory={category}
      setActiveCategory={(updatedCategory) =>
        updateFilter(
          ResearchSearchParams.category,
          updatedCategory ? (updatedCategory as ICategory)._id : '',
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
      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
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

      <Flex sx={{ width: ['100%', '100%', '220px'] }}>
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

      <Flex sx={{ width: ['100%', '100%', '270px'] }}>
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
