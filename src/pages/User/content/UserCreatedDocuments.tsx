import { Flex, Heading } from 'theme-ui'

import UserCreatedDocumentsItem from './UserCreatedDocumentsItem'

import type { UserCreatedDocs } from '../types'

interface IProps {
  docs: UserCreatedDocs
}

const UserCreatedDocuments = ({ docs }: IProps) => {
  return (
    <>
      {(docs.projects.length > 0 || docs.research.length > 0) && (
        <Flex sx={{ justifyContent: 'space-between', gap: 4 }}>
          {docs?.projects.length > 0 && (
            <Flex
              sx={{ flexDirection: 'column', flexBasis: '50%', mt: 2, mb: 6 }}
            >
              <Heading as="h3" variant="small" mb={1}>
                Library
              </Heading>
              {docs?.projects.map((item) => {
                return (
                  <UserCreatedDocumentsItem
                    key={item._id}
                    type="library"
                    item={{
                      id: item._id!,
                      slug: item.slug!,
                      title: item.title!,
                      usefulVotes: item.totalUsefulVotes!,
                    }}
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
                    key={item.id}
                    type="research"
                    item={{
                      id: item.id!,
                      slug: item.slug!,
                      title: item.title!,
                      usefulVotes: item.usefulCount!,
                    }}
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
