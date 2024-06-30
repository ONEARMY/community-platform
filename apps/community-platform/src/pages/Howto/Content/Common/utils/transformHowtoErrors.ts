import { intro as introLabels, steps as stepsLabels } from '../../../labels'

import type {
  IErrorsListSet,
  IStepErrorsList,
  ITopLevelErrorsList,
} from 'src/common/Form/types'

const stepErrors = (stepErrors: IStepErrorsList): IErrorsListSet[] => {
  return stepErrors.map((errors, index) => {
    const labels = stepsLabels
    const title = `${stepsLabels.heading.title} ${index + 1}`
    const keys = errors ? Object.keys(errors) : []

    return { errors, keys, labels, title }
  })
}

const introErrors = (errors: ITopLevelErrorsList): IErrorsListSet => {
  const labels = introLabels
  const title = introLabels.heading.title
  const keys = errors
    ? Object.keys(errors).filter((key) => introLabels[key])
    : []

  return { errors, keys, labels, title }
}

export const transformHowtoErrors = (
  errors: ITopLevelErrorsList,
): IErrorsListSet[] => {
  const transformedErrorsSet = [introErrors(errors)]

  if (errors.steps && typeof errors.steps !== 'string') {
    transformedErrorsSet.push(...stepErrors(errors.steps))
  }

  return transformedErrorsSet.filter(
    (transformedErrors) =>
      transformedErrors && transformedErrors.keys.length !== 0,
  )
}
