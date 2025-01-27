import { ErrorsContainer } from 'src/common/Form/ErrorsContainer'

import { transformLibraryErrors } from '../utils'

import type { IErrorsListSet, ITopLevelErrorsList } from 'src/common/Form/types'

interface IProps {
  errors: ITopLevelErrorsList | undefined
  isVisible: boolean
}

export const LibraryErrors = ({ errors, isVisible }: IProps) => {
  const errorsListSet = errors ? transformLibraryErrors(errors) : []

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
