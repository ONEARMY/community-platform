import React, { useState } from 'react'
import { Navigate } from '@remix-run/react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { Text } from 'theme-ui'

import { HowtoForm } from '../Common/Howto.form'

import type { ILibrary, IUser } from 'oa-shared'

interface IState {
  formValues: ILibrary.DB
  loggedInUser?: IUser | undefined
}

type EditHowtoProps = {
  howto: ILibrary.DB
}

const EditHowto = ({ howto }: EditHowtoProps) => {
  const { howtoStore } = useCommonStores().stores
  const [{ formValues, loggedInUser }] = useState<IState>({
    formValues: howto,
    loggedInUser: howtoStore.activeUser as IUser,
  })

  if (!formValues) {
    return (
      <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
        Project not found
      </Text>
    )
  }

  if (loggedInUser && isAllowedToEditContent(formValues, loggedInUser)) {
    return <HowtoForm formValues={formValues} parentType="edit" />
  } else {
    return <Navigate to={'/library/' + formValues.slug} />
  }
}

export default EditHowto
