import * as React from 'react'
import { observer } from 'mobx-react'

import { HowtoForm } from '../../../../pages/Howto/Content/Common/Howto.form'
import TEMPLATE from './Template'

import type { IHowtoFormInput } from '../../../../models/howto.models'

const CreateHowto = observer(() => {
  const formValues = { ...TEMPLATE.INITIAL_VALUES } as IHowtoFormInput

  return <HowtoForm formValues={formValues} parentType="create" />
})

export default CreateHowto
