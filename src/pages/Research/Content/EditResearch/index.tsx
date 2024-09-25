import * as React from 'react'
import { useNavigate, useParams } from '@remix-run/react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { BlockedRoute, Loader } from 'oa-components'
import ResearchForm from 'src/pages/Research/Content/Common/Research.form'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import { logger } from '../../../../logger'

import type { IResearch, IUser } from 'oa-shared'

interface IState {
  formValues: IResearch.ItemDB | null
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
          formValues: toJS(store.activeResearchItem) as IResearch.ItemDB,
          isLoading: false,
          loggedInUser: loggedInUser as IUser,
        }))
      } else {
        const doc = await store.setActiveResearchItemBySlug(slug)
        setState((prevState) => ({
          ...prevState,
          formValues: doc as IResearch.ItemDB,
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
