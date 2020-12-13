import * as React from 'react'

import Text from 'src/components/Text'
import { ResearchListItem } from './ResearchListItem'
import { ResearchStoreContext } from '../research.store'
import { Button } from 'src/components/Button'
import { observer } from 'mobx-react'
import { Box } from 'rebass'
import { MOCK_RESEARCH_ITEMS } from '../research.mocks'

export const ResearchList = observer(() => {
  const store = React.useContext(ResearchStoreContext)
  return (
    <>
      <Text>Research List</Text>
      {store.allResearchItems.map(item => (
        <ResearchListItem key={item._id} item={item} />
      ))}
      <Box mt={3}>
        <Button
          onClick={() => store.createResearchItem(MOCK_RESEARCH_ITEMS[0])}
        >
          Add Research
        </Button>
      </Box>
    </>
  )
})
