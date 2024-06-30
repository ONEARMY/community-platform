import { Field } from 'react-final-form'
import { FieldInput } from '@onearmy.apps/components'

import { FormFieldWrapper } from '../../../../pages/Howto/Content/Common/FormFieldWrapper'
import { COMPARISONS } from '../../../../utils/comparisons'
import {
  draftValidationWrapper,
  validateUrlAcceptEmpty,
} from '../../../../utils/validators'
import { MAX_LINK_LENGTH } from '../../constants'
import { intro } from '../../labels'

export const HowtoFieldFileLink = () => {
  const { description, title } = intro.fileLink
  const name = 'fileLink'

  return (
    <FormFieldWrapper htmlFor={'file-download-link'} text={title}>
      <Field
        id={name}
        name={name}
        data-cy={name}
        component={FieldInput}
        placeholder={description}
        isEqual={COMPARISONS.textInput}
        maxLength={MAX_LINK_LENGTH}
        validate={(values, allValues) =>
          draftValidationWrapper(values, allValues, validateUrlAcceptEmpty)
        }
        validateFields={[]}
      />
    </FormFieldWrapper>
  )
}
