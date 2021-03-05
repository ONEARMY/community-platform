import * as React from 'react'
import { useHistory } from 'react-router'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { IResearch } from '../../../models/research.models'
import { ResearchStoreContext } from '../research.store'

interface IProps {
  item: IResearch.ItemDB
}

export const ResearchListItem = (props: IProps) => {
  const store = React.useContext(ResearchStoreContext)
  const history = useHistory()

  const { item } = props
  return (
    <>
      <Text>{item.slug}</Text>
      <Button
        onClick={() => {
          store.deleteResearchItem(item._id)
          history.push('/research')
        }}
      >
        Delete
      </Button>
    </>
  )
}
