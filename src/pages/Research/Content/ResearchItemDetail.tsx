import { observer } from 'mobx-react'
import * as React from 'react'
import { useHistory } from 'react-router'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { ResearchStoreContext } from '../research.store'

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
  }, [props, store])

  const item = store.activeResearchItem

  return item ? (
    <>
      <Text>{item.slug}</Text>
      <Button
        backgroundColor="red"
        onClick={() => {
          store.deleteResearchItem(item._id)
          history.push('/research')
        }}
      >
        Delete
      </Button>
    </>
  ) : isLoading ? (
    // handle case where loading
    <div>loading</div>
  ) : (
    // handle case where doesn't exist
    <div>Not Found</div>
  )
})
