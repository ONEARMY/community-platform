import * as React from 'react'
import { observer } from 'mobx-react'
import { LibraryForm } from 'src/pages/Library/Content/Common/Library.form'

import TEMPLATE from './CreateLibraryTemplate'

import type { ILibrary } from 'oa-shared'

const CreateLibrary = observer(() => {
  const formValues = { ...TEMPLATE.INITIAL_VALUES } as ILibrary.FormInput

  return <LibraryForm formValues={formValues} parentType="create" />
})

export default CreateLibrary
