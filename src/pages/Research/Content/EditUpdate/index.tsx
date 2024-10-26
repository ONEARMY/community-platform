import React, { useEffect } from 'react'
import { useNavigate, useParams } from '@remix-run/react'
import { observer } from 'mobx-react'
import { BlockedRoute } from 'oa-components'
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdate.form'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import type { IResearch, IResearchDB, IUser } from 'oa-shared'

interface IState {
  formValues: IResearch.UpdateDB
  loggedInUser?: IUser | undefined
}
type IProps = {
  updateId: string
  research: IResearchDB
}

const EditUpdate = observer((props: IProps) => {
  const { update, slug } = useParams()
  const store = useResearchStore()
  const navigate = useNavigate()
  const [{ formValues, loggedInUser }] = React.useState<IState>({
    formValues: props.research.updates.find(
      (upd) => upd._id === update,
    ) as IResearch.UpdateDB,
    loggedInUser: store.activeUser as IUser,
  })

  useEffect(() => {
    if (
      !loggedInUser ||
      !isAllowedToEditContent(props.research, loggedInUser)
    ) {
      navigate('/research/' + props.research.slug)
    }
  }, [loggedInUser, formValues])

  if (!formValues) {
    return (
      <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
        Research update not found
      </Text>
    )
  }

  if (formValues.locked && formValues.locked.by !== loggedInUser?.userName) {
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
      formValues={formValues}
      research={props.research}
      redirectUrl={'/research/' + props.research.slug}
      parentType="edit"
    />
  )
})

export default EditUpdate
