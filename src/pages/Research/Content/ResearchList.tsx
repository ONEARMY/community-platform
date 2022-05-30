import { observer } from 'mobx-react'
import { Box, Flex } from 'theme-ui'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Button } from 'oa-components'
import { Heading } from 'theme-ui'
import { Link } from 'theme-ui'
import ResearchListItem from './ResearchListItem'
import { useResearchStore } from 'src/stores/Research/research.store'
import { useTheme } from '@emotion/react'

const ResearchList = observer(() => {
  const store = useResearchStore()
  const theme = useTheme()

  const { filteredResearches } = store
  return (
    <>
      <Flex py={26}>
        <Heading
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: theme.fontSizes[5],
          }}
        >
          Research topics. Can we...
        </Heading>
      </Flex>
      {filteredResearches.map((item) => (
        <ResearchListItem key={item._id} item={item} />
      ))}
      <Box mb={4}>
        <Link
          href={store.activeUser ? '/research/create' : 'sign-up'}
          mb={[3, 3, 0]}
        >
          <AuthWrapper roleRequired="beta-tester">
            <Button>Add Research</Button>
          </AuthWrapper>
        </Link>
      </Box>
    </>
  )
})
export default ResearchList
