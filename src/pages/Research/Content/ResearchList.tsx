import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { Button, Loader } from 'oa-components'
import { Link } from 'react-router-dom'
import { Box, Flex, Heading } from 'theme-ui'
import ResearchListItem from './ResearchListItem'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { RESEARCH_EDITOR_ROLES } from '../constants'
import { useEffect, useState } from 'react'
import { FilterSorterDecorator } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'
import { ResearchListSortFilterHeader } from './ResearchListSortFilterHeader/ResearchListSortFilterHeader'
import { useResearchList } from './ResearchList.hooks'
import type { IResearchListItem } from './ResearchList.hooks'

interface ResearchListFilter {
  sort?: {
    label: string
    value: string
  }
  category?: string
  search?: string
}

const ResearchList = observer(() => {
  const theme = useTheme()
  const [researchListItems, setResearchListItems] = useState<
    IResearchListItem[]
  >([])
  const [filterState, setFilterState] = useState<ResearchListFilter>({})
  const { isLoading, fullResearchListItems, activeUser } = useResearchList()
  useEffect(() => {
    setResearchListItems(fullResearchListItems)
  }, [fullResearchListItems])
  // Filtering and sorting
  const filterSorterDecorator = new FilterSorterDecorator(fullResearchListItems)

  useEffect(() => {
    if (filterState.sort?.value) {
      setResearchListItems(
        filterSorterDecorator.sort(filterState?.sort?.value) as any,
      )
    }

    if (filterState?.category) {
      setResearchListItems(
        filterSorterDecorator.filterByCategory(
          fullResearchListItems,
          filterState?.category,
        ) as any,
      )
    }

    if (filterState?.search) {
      setResearchListItems(
        filterSorterDecorator.search(
          fullResearchListItems,
          filterState?.search,
        ) as any,
      )
    }
  }, [filterState])

  return (
    <>
      <Flex my={[18, 26]}>
        <Heading
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: theme.fontSizes[5],
          }}
        >
          Help out with Research & Development
        </Heading>
      </Flex>
      <Flex
        sx={{
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
          mb: 3,
        }}
      >
        <ResearchListSortFilterHeader
          state={filterState}
          setter={setFilterState}
        />

        <Flex sx={{ justifyContent: ['flex-end', 'flex-end', 'auto'] }}>
          <Box sx={{ width: '100%', display: 'block' }} mb={[3, 3, 0]}>
            <AuthWrapper roleRequired={RESEARCH_EDITOR_ROLES}>
              <Link to={activeUser ? '/research/create' : 'sign-up'}>
                <Button variant={'primary'} data-cy="create">
                  Add Research
                </Button>
              </Link>
            </AuthWrapper>
          </Box>
        </Flex>
      </Flex>
      {isLoading ? (
        <Loader />
      ) : researchListItems?.length !== 0 ? (
        researchListItems.map((item) => {
          const votedUsefulCount = (item.votedUsefulBy || []).length
          return (
            <ResearchListItem
              key={item._id}
              item={{
                ...item,
                votedUsefulCount,
              }}
            />
          )
        })
      ) : (
        <div>No research to show</div>
      )}
      <AuthWrapper roleRequired={RESEARCH_EDITOR_ROLES}>
        <Box mb={[3, 3, 0]}>
          <Link to={activeUser ? '/research/create' : 'sign-up'}>
            <Button variant={'primary'}>Add Research</Button>
          </Link>
        </Box>
      </AuthWrapper>
    </>
  )
})
export default ResearchList
