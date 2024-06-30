import { ErrorsContainer } from '../../../../common/Form/ErrorsContainer'
import { transformHowtoErrors } from './utils/'

import type {
  IErrorsListSet,
  ITopLevelErrorsList,
} from '../../../../common/Form/types'

interface IProps {
  errors: ITopLevelErrorsList | undefined
  isVisible: boolean
}

export const HowtoErrors = ({ errors, isVisible }: IProps) => {
  const errorsListSet = errors ? transformHowtoErrors(errors) : []

  if (
    !isVisible ||
    errors === undefined ||
    Object.keys(errors).length === 0 ||
    errorsListSet.length === 0
  )
    return null

  return (
    <ErrorsContainer
      errorsListSet={errorsListSet as IErrorsListSet[]}
      isVisible={isVisible}
    />
  )
}
