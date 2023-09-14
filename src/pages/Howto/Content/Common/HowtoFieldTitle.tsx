import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'

import { COMPARISONS } from 'src/utils/comparisons'
import {
  composeValidators,
  minValue,
  required,
  validateTitle,
} from 'src/utils/validators'
import { HOWTO_TITLE_MAX_LENGTH, HOWTO_TITLE_MIN_LENGTH } from '../../constants'
import { intro } from '../../labels'
import { FormFieldWrapper } from '.'

import type { HowtoStore } from 'src/stores/Howto/howto.store'
import type { IModerable } from 'src/models/common.models'
import type { ParentType } from './Howto.form'

interface IProps {
  _id: IModerable['_id']
  parentType: ParentType
  store: HowtoStore
}

export const HowtoFieldTitle = (props: IProps) => {
  const { _id, parentType, store } = props
  const { placeholder, title } = intro.title

  const name = 'title'

  const titleValidation = (value) => {
    const validators = composeValidators(
      required,
      minValue(HOWTO_TITLE_MIN_LENGTH),
      validateTitle(parentType, _id, store),
    )

    return validators(value)
  }

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        id={name}
        name={name}
        data-cy="intro-title"
        validateFields={[]}
        validate={(value) => titleValidation(value)}
        isEqual={COMPARISONS.textInput}
        modifiers={{ capitalize: true, trim: true }}
        component={FieldInput}
        minLength={HOWTO_TITLE_MIN_LENGTH}
        maxLength={HOWTO_TITLE_MAX_LENGTH}
        placeholder={placeholder}
        showCharacterCount
      />
    </FormFieldWrapper>
  )
}
