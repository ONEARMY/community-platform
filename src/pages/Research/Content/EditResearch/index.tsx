import { useEffect, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import { observer } from 'mobx-react'
import { BlockedRoute } from 'oa-components'
import ResearchForm from 'src/pages/Research/Content/Common/Research.form'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import { logger } from '../../../../logger'

import type { IResearch, IResearchDB, IUser } from 'oa-shared'

interface IState {
  formValues: IResearch.ItemDB | null
  loggedInUser?: IUser | undefined
}

type EditResearchProps = {
  research: IResearchDB
}

const EditResearch = observer(({ research }: EditResearchProps) => {
  const store = useResearchStore()
  const navigate = useNavigate()
  const [{ formValues, loggedInUser }, setState] = useState<IState>({
    formValues: research,
    loggedInUser: store.activeUser as IUser,
  })

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      loggedInUser: store.activeUser as IUser,
    }))
  }, [store.activeUser])

  useEffect(() => {
    if (
      formValues &&
      (!loggedInUser || !isAllowedToEditContent(formValues, loggedInUser))
    ) {
      navigate('/research/' + formValues.slug)
    }
  }, [loggedInUser && formValues])

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
      research={research}
      parentType="edit"
    />
  )
})

export default EditResearch
