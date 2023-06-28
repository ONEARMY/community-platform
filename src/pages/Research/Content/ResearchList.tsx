import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { Button, Select } from 'oa-components'
import { Link, useHistory } from 'react-router-dom'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useResearchStore } from 'src/stores/Research/research.store'
import { Box, Flex, Heading, Input } from 'theme-ui'
import ResearchListItem from './ResearchListItem'
import type { RouteComponentProps } from 'react-router'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { useState } from 'react'

// Update query params for categories
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

const ResearchList = observer(() => {
  const store = useResearchStore()
  const theme = useTheme()
  const history = useHistory()

  const sortingOptions = ['Modified', 'Created', 'Most Useful', 'Comments'].map(
    (label) => ({
      label,
      value: label.toLowerCase(),
    }),
  )
  const [sortState, setSortState] = useState('')
  const { filteredResearches, searchValue } = store
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
        <Flex sx={{ width: ['100%', '240px', '240px'] }}>
          <CategoriesSelect
            value={
              store.selectedCategory ? { label: store.selectedCategory } : null
            }
            onChange={(category) => {
              updateQueryParams(
                window.location.href,
                'category',
                category ? category.label : '',
                history,
              )
              store.updateSelectedCategory(category ? category.label : '')
            }}
            placeholder="Filter by category"
            isForm={false}
            type="research"
          />
        </Flex>
        <Flex
          ml={[0, 0, '8px']}
          mb={['10px', '10px', 0]}
          sx={{ width: ['100%', '100%', '20%'] }}
        >
          <FieldContainer>
            <Select
              options={sortingOptions}
              placeholder="Sort by"
              value={sortState}
              onChange={(value) => {
                store.updateActiveSorter(String(value.value))
                setSortState(value)
              }}
            />
          </FieldContainer>
        </Flex>
        <Flex ml={[0, 0, '8px']} mr={[0, 0, 'auto']} mb={['10px', '10px', 0]}>
          <Input
            variant="inputOutline"
            data-cy="how-to-search-box"
            value={searchValue}
            placeholder="Search for a research"
            onChange={(evt) => {
              const value = evt.target.value
              updateQueryParams(window.location.href, 'search', value, history)
              store.updateSearchValue(value)
            }}
          />
        </Flex>

        <Flex sx={{ justifyContent: ['flex-end', 'flex-end', 'auto'] }}>
          <Box sx={{ width: '100%', display: 'block' }} mb={[3, 3, 0]}>
            <Link to={store.activeUser ? '/research/create' : 'sign-up'}>
              <AuthWrapper roleRequired="beta-tester">
                <Button variant={'primary'} data-cy="create">
                  Add Research
                </Button>
              </AuthWrapper>
            </Link>
          </Box>
        </Flex>
      </Flex>
      {filteredResearches?.length !== 0
        ? filteredResearches.map((item) => {
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
        : 'No research to show'}
      <Box mb={[3, 3, 0]}>
        <Link to={store.activeUser ? '/research/create' : 'sign-up'}>
          <AuthWrapper roleRequired="beta-tester">
            <Button variant={'primary'}>Add Research</Button>
          </AuthWrapper>
        </Link>
      </Box>
    </>
  )
})
export default ResearchList
