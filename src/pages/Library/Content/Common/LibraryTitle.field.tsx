import { useState } from 'react'
import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'
import { composeValidators, minValue, required } from 'src/utils/validators'
import { Card, Text } from 'theme-ui'

import {
  LIBRARY_TITLE_MAX_LENGTH,
  LIBRARY_TITLE_MIN_LENGTH,
} from '../../constants'
import { intro } from '../../labels'

import type { LibraryStore } from 'src/stores/Library/library.store'

interface IProps {
  store: LibraryStore
  _id: string
}

export const LibraryTitleField = (props: IProps) => {
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
      minValue(LIBRARY_TITLE_MIN_LENGTH),
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
        minLength={LIBRARY_TITLE_MIN_LENGTH}
        maxLength={LIBRARY_TITLE_MAX_LENGTH}
        placeholder={placeholder}
        showCharacterCount={!duplicateTitleNotice}
        customOnBlur={handleBlur}
      />
      {duplicateTitleNotice && (
        <Card sx={{ bg: 'softblue', padding: 2, marginTop: 1, border: 0 }}>
          <Text sx={{ fontSize: 1 }}>
            Did you know there is an existing project with the title '{text}'?
            Using a unique title helps readers decide which one better meets
            their needs.
          </Text>
        </Card>
      )}
    </FormFieldWrapper>
  )
}
