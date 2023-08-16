import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'

import type { ValidationErrors } from 'final-form'

const createSet = (errors, labels) => {
  const keys = Object.keys(errors).filter((key) => labels[key])

  if (keys.length !== 0) return { errors, keys, labels }
}

interface ILabels {
  [key: string]: object
}

interface IProps {
  errors: ValidationErrors
  isVisible: boolean
  labels: ILabels
}

export const ResearchErrors = ({ errors, isVisible, labels }: IProps) => {
  if (!isVisible || errors === undefined) return null

  const errorsListSet = [createSet(errors, labels)]

  return <ErrorsContainer errorsListSet={errorsListSet} isVisible={isVisible} />
}
