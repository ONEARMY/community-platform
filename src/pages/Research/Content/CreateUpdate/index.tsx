import { observer } from 'mobx-react'
import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router'
import { Loader } from 'oa-components'
import { Text } from 'theme-ui'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowToEditContent } from 'src/utils/helpers'
import { ResearchUpdateForm } from '../Common/ResearchUpdate.form'
import TEMPLATE from './Template'

type IProps = RouteComponentProps<{ slug: string }>

const CreateUpdate = observer((props: IProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const store = useResearchStore()

  React.useEffect(() => {
    ;(async () => {
      let loggedInUser = store.activeUser
      if (!loggedInUser) {
        // TODO - handle the case where user is still loading
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            loggedInUser = store.activeUser
            resolve()
          }, 3000),
        )
      }
      if (!store.activeResearchItem) {
        await store.setActiveResearchItem(props.match.params.slug)
      }
      setIsLoading(false)
    })()
  }, [store, props.match.params.slug])

  if (isLoading) {
    return <Loader />
  }
  if (!store.activeUser) {
    return <Redirect to={'/research/' + props.match.params.slug} />
  }
  if (
    store.activeResearchItem &&
    isAllowToEditContent(store.activeResearchItem, store.activeUser)
  ) {
    return (
      <ResearchUpdateForm
        formValues={TEMPLATE.INITIAL_VALUES}
        parentType="create"
        {...props}
      />
    )
  } else {
    return (
      <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
        Research not found
      </Text>
    )
  }
})

export default CreateUpdate
