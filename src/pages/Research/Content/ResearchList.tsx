import { observer } from 'mobx-react'
import { Box, Flex, Heading, Text } from 'theme-ui'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { Button, Icon } from 'oa-components'
import ResearchListItem from './ResearchListItem'
import { useResearchStore } from 'src/stores/Research/research.store'
import { useTheme } from '@emotion/react'
import { Link, useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { useCommonStores } from 'src'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import type { RouteComponentProps } from 'react-router'

const ResearchListHeader = styled.header`
  display: grid;
  grid-template-columns: 2fr minmax(274px, 1fr);
  gap: 60px;
  padding: 15px;
  padding-left: 0;
  margin-bottom: 16px;

  @media (max-width: ${theme.breakpoints[0]}) {
    padding: 15px 0;
    grid-template-columns: unset;
    gap: unset;
  }
`

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
  const { aggregationsStore } = useCommonStores().stores
  const { aggregations } = aggregationsStore
  const theme = useTheme()
  const history = useHistory()

  const { filteredResearches } = store
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
      <ResearchListHeader>
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
          sx={{
            alignItems: 'center',
            justifyContent: 'space-around',
            display: ['none', 'flex'],
          }}
        >
          <Text
            color={theme.colors.black}
            sx={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}
          >
            <Icon glyph="star-active" mr={1} />
            Useful
          </Text>
          <Text
            color={theme.colors.black}
            sx={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}
          >
            <Icon glyph="comment" mr={1} />
            Comments
          </Text>
          <Text color={theme.colors.black} sx={{ fontSize: '16px' }}>
            Updates
          </Text>
        </Flex>
      </ResearchListHeader>
      {filteredResearches.map((item) => {
        const votedUsefulCount = aggregations.users_votedUsefulResearch
          ? aggregations.users_votedUsefulResearch[item._id] || '-'
          : '-'

        return (
          <ResearchListItem
            key={item._id}
            item={{
              ...item,
              votedUsefulCount,
            }}
          />
        )
      })}
      <Box mb={[3, 3, 0]}>
        <Link to={store.activeUser ? '/research/create' : 'sign-up'}>
          <AuthWrapper roleRequired="beta-tester">
            <Button>Add Research</Button>
          </AuthWrapper>
        </Link>
      </Box>
    </>
  )
})
export default ResearchList
