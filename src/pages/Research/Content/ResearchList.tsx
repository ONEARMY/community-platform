import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { Button, Icon } from 'oa-components'
import { Link, useHistory } from 'react-router-dom'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useResearchStore } from 'src/stores/Research/research.store'
import { Box, Flex, Grid, Heading, Text } from 'theme-ui'
import ResearchListItem from './ResearchListItem'
import type { RouteComponentProps } from 'react-router'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'

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

      <Grid
        sx={{
          gridTemplateColumns: ['unset', '2fr minmax(274px, 1fr)', null],
          gap: '60px',
          padding: 2,
          px: 0,
          mb: 2,
        }}
      >
        <Flex
          sx={{
            flexWrap: 'nowrap',
            gap: '2em',
            flexDirection: ['column', 'column', 'row'],
          }}
        >
          <Flex sx={{ width: ['100%', '240px', '240px'] }}>
            <CategoriesSelect
              value={
                store.selectedCategory
                  ? { label: store.selectedCategory }
                  : null
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
      </Grid>
      {filteredResearches.map((item) => {
        const votedUsefulCount = item.votedUsefulCount ?? 0
        return (
          <ResearchListItem
            key={item._id}
            item={{
              ...item,
              votedUsefulCount
            }}
          />
        )
      })}
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
