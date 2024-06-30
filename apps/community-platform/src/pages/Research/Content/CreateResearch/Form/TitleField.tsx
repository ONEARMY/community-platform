import { Field } from 'react-final-form'
import { FieldInput } from '@onearmy.apps/components'
import { Flex, Label } from 'theme-ui'

import { useResearchStore } from '../../../../../stores/Research/research.store'
import { COMPARISONS } from '../../../../../utils/comparisons'
import {
  composeValidators,
  minValue,
  required,
  validateTitle,
} from '../../../../../utils/validators'
import {
  RESEARCH_TITLE_MAX_LENGTH,
  RESEARCH_TITLE_MIN_LENGTH,
} from '../../../constants'
import { update as updateLabels } from '../../../labels'

export const TitleField = ({ formValues, parentType }) => {
  const store = useResearchStore()
  const { title, placeholder } = updateLabels.title

  const titleValidator = () =>
    composeValidators(
      required,
      minValue(RESEARCH_TITLE_MIN_LENGTH),
      validateTitle(parentType, formValues._id, store),
    )

  return (
    <Flex sx={{ flexDirection: 'column' }} mb={3}>
      <Label htmlFor="title" sx={{ mb: 2 }}>
        {title}
      </Label>
      <Field
        id="title"
        name="title"
        data-cy="intro-title"
        validateFields={[]}
        validate={titleValidator()}
        isEqual={COMPARISONS.textInput}
        component={FieldInput}
        maxLength={RESEARCH_TITLE_MAX_LENGTH}
        minLength={RESEARCH_TITLE_MIN_LENGTH}
        showCharacterCount
        placeholder={placeholder}
      />
    </Flex>
  )
}
