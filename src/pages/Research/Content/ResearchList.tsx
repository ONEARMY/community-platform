import { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Box, Flex } from 'rebass/styled-components'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { Button } from 'src/components/Button'
import Heading from 'src/components/Heading'
import { Link } from 'src/components/Links'
import ResearchListItem from 'src/components/Research/ResearchListItem'
import { useResearchStore } from 'src/stores/Research/research.store'
import { useCommonStores } from 'src'

const ResearchList = observer(() => {
  const store = useResearchStore()
  const {
    stores: { userStore },
  } = useCommonStores()

  useEffect(() => {
    if (userStore) {
      userStore.fetchAllVerifiedUsers()
    }
  }, [userStore])

  const { filteredResearches } = store
  return (
    <>
      <Flex py={26}>
        <Heading medium bold txtcenter width={1}>
          Research topics. Can we...
        </Heading>
      </Flex>
      {filteredResearches.map(item => (
        <ResearchListItem
          key={item._id}
          item={item}
          verified={userStore?.verifiedUsers?.[item._createdBy]}
        />
      ))}
      <Box mb={4}>
        <Link
          to={store.activeUser ? '/research/create' : 'sign-up'}
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
