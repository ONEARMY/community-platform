import { observer } from 'mobx-react'
import * as React from 'react'
import { Box, Flex } from 'rebass'
import { Button } from 'src/components/Button'
import { Link } from 'src/components/Links'
import { Loader } from 'src/components/Loader'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowToEditContent } from 'src/utils/helpers'
import ResearchDescription from './ResearchDescription'
import Update from './Update'

interface IProps {
  slug: string
}

export const ResearchItemDetail = observer((props: IProps) => {
  const store = useResearchStore()

  const [isLoading, setIsLoading] = React.useState(true)

  const moderateResearch = async (accepted: boolean) => {
    const item = store.activeResearchItem
    if (item) {
      item.moderation = accepted ? 'accepted' : 'rejected'
      await store.moderateResearch(item)
    }
  }

  React.useEffect(() => {
    ;(async () => {
      const { slug } = props
      await store.setActiveResearchItem(slug)
      setIsLoading(false)
    })()

    // Reset the store's active item on component cleanup
    return () => {
      store.setActiveResearchItem()
    }
  }, [props, store])

  const item = store.activeResearchItem

  return item ? (
    <>
      <ResearchDescription
        research={item}
        loggedInUser={store.activeUser}
        needsModeration={store.needsModeration(item)}
        moderateResearch={moderateResearch}
      />
      <Box mt={9}>
        {item.updates.map((update, index) => {
          return <Update update={update} key={update._id} updateIndex={index} />
        })}
      </Box>
      {store.activeUser && isAllowToEditContent(item, store.activeUser) && (
        <Flex my={4}>
          <Link to={`/research/${item.slug}/new-update`} mb={[3, 3, 0]}>
            <Button large ml={2}>
              Add update
            </Button>
          </Link>
        </Flex>
      )}
    </>
  ) : isLoading ? (
    <Loader />
  ) : (
    <NotFoundPage />
  )
})
