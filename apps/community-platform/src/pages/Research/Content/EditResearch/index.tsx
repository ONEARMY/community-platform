import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BlockedRoute, Loader } from '@onearmy.apps/components'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Text } from 'theme-ui'

import { logger } from '../../../../logger'
import ResearchForm from '../../../../pages/Research/Content/Common/Research.form'
import { useResearchStore } from '../../../../stores/Research/research.store'
import { isAllowedToEditContent } from '../../../../utils/helpers'

import type { IResearchItemDB, IUser } from '../../../../models'

interface IState {
  formValues: IResearchItemDB | null
  isLoading: boolean
  loggedInUser?: IUser | undefined
}

const EditResearch = observer(() => {
  const { slug } = useParams()
  const store = useResearchStore()
  const navigate = useNavigate()
  const [{ formValues, isLoading, loggedInUser }, setState] =
    React.useState<IState>({
      formValues: store.activeResearchItem,
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
      if (store.activeResearchItem) {
        setState((prevState) => ({
          ...prevState,
          formValues: toJS(store.activeResearchItem) as IResearchItemDB,
          isLoading: false,
          loggedInUser: loggedInUser as IUser,
        }))
      } else {
        const doc = await store.setActiveResearchItemBySlug(slug)
        setState((prevState) => ({
          ...prevState,
          formValues: doc as IResearchItemDB,
          isLoading: false,
          loggedInUser: loggedInUser as IUser,
        }))
      }
    }
    init()
  }, [slug])

  React.useEffect(() => {
    if (
      formValues &&
      (!loggedInUser || !isAllowedToEditContent(formValues, loggedInUser))
    ) {
      navigate('/research/' + formValues.slug)
    }
  }, [loggedInUser && formValues])

  if (isLoading) {
    return <Loader />
  }

  if (!formValues) {
    return (
      <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
        Research not found
      </Text>
    )
  }

  if (formValues.locked && formValues.locked.by !== loggedInUser?.userName) {
    logger.info('Research is locked', formValues.locked)
    return (
      <BlockedRoute>
        The research description is currently being edited by another editor.
      </BlockedRoute>
    )
  }

  return (
    <ResearchForm
      data-testid="EditResearch"
      formValues={formValues}
      parentType="edit"
    />
  )
})

export default EditResearch
