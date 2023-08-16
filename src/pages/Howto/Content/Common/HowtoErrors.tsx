import type { ValidationErrors } from 'final-form'

import { ErrorsContainer } from '../../../../../src/common/Form/ErrorsContainer'
import { intro, steps } from '../../labels'

const stepErrors = (stepErrors) => {
  const emptyList = new Array(stepErrors.length).fill([])
  const stepsWithErrors = emptyList.map((_, index) =>
    Object.keys(stepErrors[index]),
  )
  const errors = stepsWithErrors.map((keys, index) => {
    const errors = stepErrors[index]
    const labels = steps
    const title = `${steps.heading.title} ${index + 1}`

    if (keys.length > 0) return { errors, keys, labels, title }
  })

  return errors.filter((error) => error !== undefined)
}

const introErrors = (errors) => {
  const labels = intro
  const title = intro.heading
  const keys = Object.keys(errors).filter((key) => intro[key])

  if (keys.length !== 0) return { errors, keys, labels, title }
}

interface IProps {
  errors: ValidationErrors
  isVisible: boolean
}

export const HowtoErrors = ({ errors, isVisible }: IProps) => {
  if (!isVisible || errors === undefined || errors.length === 0) return null

  const errorsListSet = [introErrors(errors), ...stepErrors(errors.steps || [])]

  return <ErrorsContainer errorsListSet={errorsListSet} isVisible={isVisible} />
}
