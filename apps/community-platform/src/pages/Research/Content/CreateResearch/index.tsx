import React from 'react'
import { observer } from 'mobx-react'
import { Flex, Text } from 'theme-ui'

import { useCommonStores } from '../../../../common/hooks/useCommonStores'
import ResearchForm from '../../../../pages/Research/Content/Common/Research.form'
import TEMPLATE from './Template'

import type { IUser } from '../../../../models/user.models'

const CreateResearch = observer(() => {
  const { userStore } = useCommonStores().stores
  const currentUser = userStore.user as IUser
  const formValues = { ...TEMPLATE.INITIAL_VALUES }

  return currentUser ? (
    <ResearchForm formValues={formValues} parentType="create" />
  ) : (
    <Flex sx={{ justifyContent: 'center' }} mt="40px">
      <Text>Please login to access this page</Text>
    </Flex>
  )
})

export default CreateResearch
