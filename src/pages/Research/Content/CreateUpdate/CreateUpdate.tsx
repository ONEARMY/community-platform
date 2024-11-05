import { observer } from 'mobx-react'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import { ResearchUpdateForm } from '../Common/ResearchUpdate.form'
import TEMPLATE from './Template'

import type { IResearchDB } from 'oa-shared'

type CreateUpdateProps = {
  research: IResearchDB
}

const CreateUpdate = observer(({ research }: CreateUpdateProps) => {
  const store = useResearchStore()

  if (store.activeUser && isAllowedToEditContent(research, store.activeUser)) {
    return (
      <ResearchUpdateForm
        research={research}
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
