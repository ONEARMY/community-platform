import * as React from 'react'
import { Flex, Heading } from 'theme-ui'
import UserDocumentItem from './UserDocumentItem'
import { AuthWrapper } from 'src/common/AuthWrapper'
import type { UserCreatedDocs } from '.'

interface IProps {
  docs: UserCreatedDocs | undefined
}

const UserCreatedDocuments = ({ docs }: IProps) => {
  return (
    <AuthWrapper roleRequired="beta-tester">
      {(docs?.howtos.length > 0 || docs?.research.length > 0) && (
        <Flex pt={2} sx={{ justifyContent: 'space-between' }}>
          {docs?.howtos.length > 0 && (
            <Flex
              mt={2}
              mb={6}
              mx={2}
              px={2}
              sx={{ flexDirection: 'column', flexBasis: '50%' }}
            >
              <Heading mb={1}>Created How-To's</Heading>
              {docs?.howtos.map((item) => {
                return (
                  <UserDocumentItem key={item._id} type="how-to" item={item} />
                )
              })}
            </Flex>
          )}
          {docs?.research.length > 0 && (
            <Flex
              my={2}
              mx={2}
              px={2}
              sx={{ flexDirection: 'column', flexBasis: '50%' }}
            >
              <Heading mb={1}>Created Research</Heading>
              {docs?.research.map((item) => {
                return (
                  <UserDocumentItem
                    key={item._id}
                    type="research"
                    item={item}
                  />
                )
              })}
            </Flex>
          )}
        </Flex>
      )}
    </AuthWrapper>
  )
}

export default UserCreatedDocuments
