import { useEffect, useMemo } from 'react'
import { useNavigate } from '@remix-run/react'
import { observer } from 'mobx-react'
import { BlockedRoute } from 'oa-components'
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdate.form'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import type { IResearch, IResearchDB } from 'oa-shared'

type IProps = {
  updateId: string
  research: IResearchDB
}

const EditUpdate = observer((props: IProps) => {
  const store = useResearchStore()
  const navigate = useNavigate()
  const loggedInUser = store.activeUser
  const formValues = useMemo<IResearch.UpdateDB>(
    () =>
      props.research.updates.find(
        (upd) => upd._id === props.updateId,
      ) as IResearch.UpdateDB,
    [props.updateId, props.research.updates],
  )

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
        redirectUrl={`/research/${props.research.slug}`}
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
