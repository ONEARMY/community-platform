import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'

import type {
  IErrorsListSet,
  ILabels,
  ITopLevelErrorsList,
} from 'src/common/Form/types'

const createSet = (errors, labels) => {
  const keys = Object.keys(errors).filter((key) => labels[key])

  if (keys.length !== 0) return { errors, keys, labels }
}

interface IProps {
  errors: ITopLevelErrorsList | undefined
  isVisible: boolean
  labels: ILabels
}

export const ResearchErrors = ({ errors, isVisible, labels }: IProps) => {
  if (!isVisible || errors === undefined) return null

  const errorsListSet = [createSet(errors, labels)]

  return (
    <ErrorsContainer
      errorsListSet={errorsListSet as IErrorsListSet[]}
      isVisible={isVisible}
    />
  )
}
