import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { Button } from 'oa-components'
import { Link } from 'react-router-dom'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useResearchStore } from 'src/stores/Research/research.store'
import { Box, Flex, Heading } from 'theme-ui'
import ResearchListItem from './ResearchListItem'
import { SortFilterHeader } from 'src/pages/common/SortFilterHeader/SortFilterHeader'

const ResearchList = observer(() => {
  const store = useResearchStore()
  const theme = useTheme()

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

      <Flex
        sx={{
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
          mb: 3,
        }}
      >
        <SortFilterHeader store={store} type="research" />

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
