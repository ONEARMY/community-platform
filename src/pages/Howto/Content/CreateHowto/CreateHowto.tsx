import * as React from 'react'
import type { IHowtoFormInput } from 'src/models/howto.models'
import TEMPLATE from './Template'

import { observer } from 'mobx-react'
import { HowtoForm } from 'src/pages/Howto/Content/Common/Howto.form'

const CreateHowto = observer(() => {
  const formValues = { ...TEMPLATE.INITIAL_VALUES } as IHowtoFormInput

  return <HowtoForm formValues={formValues} parentType="create" />
})

export default CreateHowto
