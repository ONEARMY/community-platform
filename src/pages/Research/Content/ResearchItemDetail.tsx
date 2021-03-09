import { observer } from 'mobx-react'
import * as React from 'react'
import { useHistory } from 'react-router'
import { Box, Flex } from 'rebass'
import { Button } from 'src/components/Button'
import { Loader } from 'src/components/Loader'
import { MOCK_UPDATES } from 'src/mocks/research.mocks'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { ResearchStoreContext } from 'src/stores/Research/research.store'
import ResearchDescription from './ResearchDescription'
import Update from './Update'

interface IProps {
  slug: string
}

export const ResearchItemDetail = observer((props: IProps) => {
  const store = React.useContext(ResearchStoreContext)
  const history = useHistory()

  const [isLoading, setIsLoading] = React.useState(true)

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
      <ResearchDescription research={item} loggedInUser={undefined} />
      <Box mt={9}>
        {item.updates.map((update, index) => {
          return <Update update={update} key={update._id} updateIndex={index} />
        })}
      </Box>
      <Flex my={4}>
        <Button
          backgroundColor="red"
          onClick={() => {
            store.deleteResearchItem(item._id)
            history.push('/research')
          }}
        >
          Delete
        </Button>
        <Button
          ml={2}
          onClick={() => {
            store.addUpdate(
              item,
              MOCK_UPDATES[Math.floor(Math.random() * MOCK_UPDATES.length)],
            )
            store.setActiveResearchItem(item.slug)
          }}
        >
          Add update
        </Button>
      </Flex>
    </>
  ) : isLoading ? (
    <Loader />
  ) : (
    <NotFoundPage />
  )
})
