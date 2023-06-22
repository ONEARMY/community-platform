import * as React from 'react'
import { Flex, Heading } from 'theme-ui'
import UserCreatedDocumentsItem from './UserCreatedDocumentsItem'
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
              <Heading mb={1}>How-To's</Heading>
              {docs?.howtos.map((item) => {
                return (
                  <UserCreatedDocumentsItem
                    key={item._id}
                    type="how-to"
                    item={item}
                  />
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
              <Heading mb={1}>Research</Heading>
              {docs?.research.map((item) => {
                return (
                  <UserCreatedDocumentsItem
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
