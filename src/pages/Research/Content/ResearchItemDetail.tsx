import * as React from 'react'
import Text from 'src/components/Text'
import { ResearchStoreContext } from '../research.store'

interface IProps {
  slug: string
}

export const ResearchItemDetail = (props: IProps) => {
  const store = React.useContext(ResearchStoreContext)
  React.useEffect(() => {
    const { slug } = props
    store.setActiveResearchItem(slug)
  }, [props, store])
  const item = store.activeResearchItem
  return item ? (
    <>
      <Text>{item.slug}</Text>
    </>
  ) : (
    // handle case where loading

    // handle case where doesn't exist
    <div>Not Found</div>
  )
}
