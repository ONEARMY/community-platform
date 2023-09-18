import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { Text, Card } from 'theme-ui'
import { useState } from 'react'

import { COMPARISONS } from 'src/utils/comparisons'
import { composeValidators, minValue, required } from 'src/utils/validators'
import { HOWTO_TITLE_MAX_LENGTH, HOWTO_TITLE_MIN_LENGTH } from '../../constants'
import { intro } from '../../labels'
import { FormFieldWrapper } from '.'

import type { HowtoStore } from 'src/stores/Howto/howto.store'

interface IProps {
  store: HowtoStore
  _id: string
}

export const HowtoFieldTitle = (props: IProps) => {
  const { store, _id } = props
  const { placeholder, title } = intro.title

  const name = 'title'
  const [duplicateTitleNotice, setduDuplicateTitleNotice] = useState(false)
  const [text, setText] = useState('')

  const handleBlur = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = ev.target.value
    setText(newTitle)
    const isDuplicateTitle = await store.isTitleThatReusesSlug(newTitle, _id)
    setduDuplicateTitleNotice(isDuplicateTitle)
  }

  const titleValidation = (value) => {
    const validators = composeValidators(
      required,
      minValue(HOWTO_TITLE_MIN_LENGTH),
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
        showCharacterCount={!duplicateTitleNotice}
        customOnBlur={handleBlur}
      />
      {duplicateTitleNotice && (
        <Card sx={{ bg: 'softblue', padding: 2, marginTop: 1, border: 0 }}>
          <Text sx={{ fontSize: 1 }}>
            Did you know there is an existing how-to with the title '{text}'?
            Using a unique title helps readers decide which how-to better meet
            their needs.
          </Text>
        </Card>
      )}
    </FormFieldWrapper>
  )
}
