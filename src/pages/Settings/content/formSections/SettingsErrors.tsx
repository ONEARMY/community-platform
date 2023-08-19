import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'
import { defaultError, fields } from 'src/pages/Settings/labels'

import type { ValidationErrors } from 'final-form'

const flattenErrors = (formErrors) => {
  const errors = {}

  Object.keys(formErrors).forEach((key) => {
    if (typeof formErrors[key] !== 'string') return (errors[key] = defaultError)
    errors[key] = formErrors[key]
  })

  return errors
}

const createSet = (formErrors: object) => {
  const errors = flattenErrors(formErrors)
  const keys = Object.keys(errors).filter((key) => fields[key])
  const labels = fields

  if (keys.length !== 0) return { errors, keys, labels }
}

interface IProps {
  errors: ValidationErrors
  isVisible: boolean
}

export const SettingsErrors = ({ errors, isVisible }: IProps) => {
  if (!isVisible || errors === undefined) return null

  const errorsListSet = [createSet(errors)]

  return <ErrorsContainer errorsListSet={errorsListSet} isVisible={isVisible} />
}
