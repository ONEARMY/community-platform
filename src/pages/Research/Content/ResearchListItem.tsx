import * as React from 'react'
import Text from 'src/components/Text'
import { IResearch } from '../research.models'
import { ResearchStoreContext } from '../research.store'
import { Button } from 'src/components/Button'

interface IProps {
  item: IResearch.ItemDB
}

export const ResearchListItem = (props: IProps) => {
  console.log('props', props)
  const { item } = props
  const store = React.useContext(ResearchStoreContext)
  return (
    <>
      <Text>{item.slug}</Text>
      <Button onClick={() => store.deleteResearchItem(item._id)}>Delete</Button>
    </>
  )
}
