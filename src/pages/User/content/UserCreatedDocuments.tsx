import { Flex, Heading } from 'theme-ui'

import UserCreatedDocumentsItem from './UserCreatedDocumentsItem'

import type { UserCreatedDocs } from '../types'

interface IProps {
  docs: UserCreatedDocs
}

const UserCreatedDocuments = ({ docs }: IProps) => {
  return (
    <>
      {(docs.library.length > 0 || docs.research.length > 0) && (
        <Flex pt={2} sx={{ justifyContent: 'space-between', gap: 4 }}>
          {docs?.library.length > 0 && (
            <Flex
              mt={2}
              mb={6}
              sx={{ flexDirection: 'column', flexBasis: '50%' }}
            >
              <Heading as="h3" variant="small" mb={1}>
                Library
              </Heading>
              {docs?.library.map((item) => {
                return (
                  <UserCreatedDocumentsItem
                    key={item._id}
                    type="library"
                    item={item}
                  />
                )
              })}
            </Flex>
          )}
          {docs?.research.length > 0 && (
            <Flex my={2} sx={{ flexDirection: 'column', flexBasis: '50%' }}>
              <Heading as="h3" variant="small" mb={1}>
                Research
              </Heading>
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
    </>
  )
}

export default UserCreatedDocuments
