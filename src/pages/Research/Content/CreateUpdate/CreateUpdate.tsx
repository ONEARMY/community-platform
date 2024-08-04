import React from 'react'
import { Navigate, useParams } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Loader } from 'oa-components'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import { ResearchUpdateForm } from '../Common/ResearchUpdate.form'
import TEMPLATE from './Template'

const CreateUpdate = observer(() => {
  const { slug } = useParams()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const store = useResearchStore()

  React.useEffect(() => {
    const init = async () => {
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
        await store.setActiveResearchItemBySlug(slug)
      }
      setIsLoading(false)
    }
    init()
  }, [slug])

  if (isLoading) {
    return <Loader />
  }
  if (!store.activeUser) {
    return <Navigate to={'/research/' + slug} />
  }

  if (
    store.activeResearchItem &&
    isAllowedToEditContent(store.activeResearchItem, store.activeUser)
  ) {
    return (
      <ResearchUpdateForm
        formValues={TEMPLATE.INITIAL_VALUES}
        parentType="create"
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
