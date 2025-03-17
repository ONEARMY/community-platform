import { observer } from 'mobx-react'
import ResearchForm from 'src/pages/Research/Content/Common/Research.form'

import TEMPLATE from './Template'

const CreateResearch = observer(() => {
  const formValues = { ...TEMPLATE.INITIAL_VALUES }

  return <ResearchForm formValues={formValues} parentType="create" />
})

export default CreateResearch
