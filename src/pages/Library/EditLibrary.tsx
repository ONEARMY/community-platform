import React, { useState } from 'react'
import { Navigate } from '@remix-run/react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import { LibraryForm } from './Content/Common/Library.form'

import type { ILibrary, IUser } from 'oa-shared'

interface IState {
  formValues: ILibrary.DB
  loggedInUser?: IUser | undefined
}

type EditLibraryProps = {
  item: ILibrary.DB
}

const EditLibrary = ({ item }: EditLibraryProps) => {
  const { LibraryStore } = useCommonStores().stores
  const [{ formValues, loggedInUser }] = useState<IState>({
    formValues: item,
    loggedInUser: LibraryStore.activeUser as IUser,
  })

  if (!formValues) {
    return (
      <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
        Project not found
      </Text>
    )
  }

  if (loggedInUser && isAllowedToEditContent(formValues, loggedInUser)) {
    return <LibraryForm formValues={formValues} parentType="edit" />
  } else {
    return <Navigate to={'/library/' + formValues.slug} />
  }
}

export default EditLibrary
