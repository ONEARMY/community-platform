import { observer } from 'mobx-react'
import * as React from 'react'
import { Box, Flex } from 'rebass'
import { Button } from 'src/components/Button'
import Heading from 'src/components/Heading'
import ResearchListItem from 'src/components/Research/ResearchListItem'
import { MOCK_RESEARCH_ITEMS } from 'src/mocks/research.mocks'
import { ResearchStoreContext } from '../research.store'

export const ResearchList = observer(() => {
  const store = React.useContext(ResearchStoreContext)
  return (
    <>
      <Flex py={26}>
        <Heading medium bold txtcenter width={1} my={20}>
          Research topics. Can we...
        </Heading>
      </Flex>
      {store.allResearchItems.map(item => (
        <ResearchListItem key={item._id} item={item} />
      ))}
      <Box>
        <Button
          onClick={() =>
            store.createResearchItem(
              MOCK_RESEARCH_ITEMS[
                Math.floor(Math.random() * MOCK_RESEARCH_ITEMS.length)
              ],
            )
          }
        >
          Add Research
        </Button>
      </Box>
    </>
  )
})
