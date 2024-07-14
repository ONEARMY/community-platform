import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { BlockedRoute, Loader } from 'oa-components'
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdate.form'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import type { IResearch } from 'src/models/research.models'
import type { IUser } from 'src/models/user.models'

interface IState {
  formValues: IResearch.UpdateDB
  isLoading: boolean
  loggedInUser?: IUser | undefined
}
type IProps = {
  updateId?: string
}

const EditUpdate = observer((props: IProps) => {
  const { update, slug } = useParams()
  const store = useResearchStore()
  const navigate = useNavigate()
  const [state, setState] = React.useState<IState>({
    formValues: {} as IResearch.UpdateDB,
    isLoading: !store.activeResearchItem,
    loggedInUser: store.activeUser as IUser,
  })

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
      const updateId = props.updateId ? props.updateId : update
      if (store.activeResearchItem) {
        const update = store.activeResearchItem.updates.find(
          (upd) => upd._id === updateId,
        )
        setState((prevState) => ({
          ...prevState,
          formValues: toJS(update) as IResearch.UpdateDB,
          isLoading: false,
          loggedInUser: loggedInUser as IUser,
        }))
      } else {
        const doc = await store.setActiveResearchItemBySlug(slug)
        let update
        if (doc) {
          update = doc.updates.find((upd) => upd._id === updateId)
        }
        setState((prevState) => ({
          ...prevState,
          formValues: update as IResearch.UpdateDB,
          isLoading: false,
          loggedInUser: loggedInUser as IUser,
        }))
      }
    }
    init()
  }, [slug, update, props.updateId])

  useEffect(() => {
    if (store.activeResearchItem) {
      if (
        !state.loggedInUser ||
        !isAllowedToEditContent(store.activeResearchItem, state.loggedInUser)
      ) {
        navigate('/research/' + store.activeResearchItem.slug)
      }
    }
  }, [state.loggedInUser, store.activeResearchItem])

  if (state.isLoading) {
    return <Loader />
  }

  if (!state.formValues) {
    return (
      <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
        Research update not found
      </Text>
    )
  }

  if (
    state.formValues.locked &&
    state.formValues.locked.by !== state.loggedInUser?.userName
  ) {
    return (
      <BlockedRoute
        redirectLabel="Back to research"
        redirectUrl={`/research/${slug}`}
      >
        This research update is currently being edited by another editor.
      </BlockedRoute>
    )
  }

  return (
    <ResearchUpdateForm
      formValues={state.formValues}
      redirectUrl={'/research/' + store.activeResearchItem?.slug}
      parentType="edit"
    />
  )
})

export default EditUpdate
