import React from 'react'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import ResearchForm from 'src/pages/Research/Content/Common/Research.form'
import { Flex, Text } from 'theme-ui'

import TEMPLATE from './Template'

import type { IUser } from 'oa-shared'

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
