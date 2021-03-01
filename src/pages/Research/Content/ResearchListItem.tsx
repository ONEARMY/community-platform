import * as React from 'react'
import Text from 'src/components/Text'
import { ResearchStoreContext } from '../research.store'
import { Button } from 'src/components/Button'
import { IResearch } from '../research.models'

interface IProps {
  item: IResearch.ItemDB
}

export const ResearchListItem = (props: IProps) => {
  const store = React.useContext(ResearchStoreContext)
  const { item } = props
  return (
    <>
      <Text>{item.slug}</Text>
      <Button onClick={() => store.deleteResearchItem(item._id)}>Delete</Button>
    </>
  )
}
