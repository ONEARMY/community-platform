// import { useCallback, useEffect, useState } from 'react'
import { Link } from '@remix-run/react'
// import debounce from 'debounce'
import { Tooltip } from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
// import { FieldContainer } from 'src/common/Form/FieldContainer'
import { UserAction } from 'src/common/UserAction'
// import {
//   NewsSearchParams,
// } from 'src/pages/News/newsContent.service'
import { Button } from 'theme-ui'

import DraftButton from '../common/Drafts/DraftButton'
import { ListHeader } from '../common/Layout/ListHeader'
import { headings, listing } from './labels'
// import { NewsSortOptions } from './NewsSortOptions'

// import type { Category } from 'oa-shared'

interface IProps {
  draftCount: number
  handleShowDrafts: () => void
  showDrafts: boolean
}

export const NewsListHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props

  // const [categories, setCategories] = useState<Category[]>([])
  // const [searchString, setSearchString] = useState<string>('')

  // const [searchParams, setSearchParams] = useSearchParams()
  // const categoryParam = searchParams.get(NewsSearchParams.category)
  // const category =
  //   (categoryParam && categories?.find((x) => x.id === +categoryParam)) ?? null
  // const q = searchParams.get(NewsSearchParams.q)
  // const sort = searchParams.get(NewsSearchParams.sort) as NewsSortOption

  // useEffect(() => {
  //   const initCategories = async () => {
  //     const categories = (await newsContentService.getCategories()) || []
  //     setCategories(categories)
  //   }

  //   initCategories()
  // }, [])

  // useEffect(() => {
  //   setSearchString(q || '')
  // }, [q])

  // const updateFilter = useCallback(
  //   (key: NewsSearchParams, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString())
  //     if (value) {
  //       params.set(key, value)
  //     } else {
  //       params.delete(key)
  //     }
  //     setSearchParams(params)
  //   },
  //   [searchParams],
  // )

  // const onSearchInputChange = useCallback(
  //   debounce((value: string) => {
  //     searchValue(value)
  //   }, 500),
  //   [searchParams],
  // )

  // const searchValue = (value: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('q', value)

  //   if (value.length > 0 && sort !== 'MostRelevant') {
  //     params.set('sort', 'MostRelevant')
  //   }

  //   if (value.length === 0 || !value) {
  //     params.set('sort', 'Newest')
  //   }

  //   setSearchParams(params)
  // }

  const actionComponents = (
    <UserAction
      incompleteProfile={
        <AuthWrapper roleRequired={UserRole.ADMIN}>
          <Link
            to="/settings"
            data-tooltip-id="tooltip"
            data-tooltip-content={listing.incompleteProfile}
          >
            <Button
              type="button"
              data-cy="complete-profile-news"
              variant="disabled"
            >
              {listing.create}
            </Button>
          </Link>
          <Tooltip id="tooltip" />
        </AuthWrapper>
      }
      loggedIn={
        <AuthWrapper roleRequired={UserRole.ADMIN}>
          <DraftButton
            showDrafts={showDrafts}
            draftCount={draftCount}
            handleShowDrafts={handleShowDrafts}
          />
          <Link to="/news/create">
            <Button type="button" data-cy="create-news" variant="primary">
              {listing.create}
            </Button>
          </Link>
        </AuthWrapper>
      }
      loggedOut={<></>}
    />
  )

  // const categoryComponent = (
  //   <CategoryHorizonalList
  //     allCategories={categories}
  //     activeCategory={category !== '' ? category : null}
  //     setActiveCategory={(updatedCategory) =>
  //       updateFilter(
  //         NewsSearchParams.category,
  //         updatedCategory ? (updatedCategory as Category).id.toString() : '',
  //       )
  //     }
  //   />
  // )

  // const filteringComponents = (
  //   <Flex
  //     sx={{
  //       gap: 2,
  //       flexDirection: ['column', 'column', 'row'],
  //       flexWrap: 'wrap',
  //     }}
  //   >
  //     <Flex sx={{ width: ['100%', '100%', '230px'] }}>
  //       <FieldContainer>
  //         <Select
  //           options={NewsSortOptions.toArray(!!q)}
  //           placeholder={listing.sort}
  //           value={{ label: NewsSortOptions.get(sort) }}
  //           onChange={(sortBy) =>
  //             updateFilter(NewsSearchParams.sort, sortBy.value)
  //           }
  //         />
  //       </FieldContainer>
  //     </Flex>
  //     <Flex sx={{ width: ['100%', '100%', '300px'] }}>
  //       <SearchField
  //         dataCy="news-search-box"
  //         placeHolder={listing.search}
  //         value={searchString}
  //         onChange={(value) => {
  //           setSearchString(value)
  //           onSearchInputChange(value)
  //         }}
  //         onClickDelete={() => {
  //           setSearchString('')
  //           searchValue('')
  //         }}
  //         onClickSearch={() => searchValue(searchString)}
  //       />
  //     </Flex>
  //   </Flex>
  // )

  return (
    <ListHeader
      actionComponents={actionComponents}
      actionComponentsMaxWidth="650px"
      showDrafts={showDrafts}
      headingTitle={headings.list}
      categoryComponent={<></>}
      filteringComponents={<></>}
    />
  )
}
