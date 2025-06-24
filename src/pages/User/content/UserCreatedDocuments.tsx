import { Flex, Heading } from 'theme-ui'

import UserCreatedDocumentsItem from './UserCreatedDocumentsItem'

import type { UserCreatedDocs } from 'oa-shared'

interface IProps {
  docs: UserCreatedDocs
}

const UserCreatedDocuments = ({ docs }: IProps) => {
  return (
    <>
      {(docs.projects.length > 0 ||
        docs.research.length > 0 ||
        docs.questions.length > 0) && (
        <Flex sx={{ justifyContent: 'space-between', gap: 4 }}>
          {docs?.projects.length > 0 && (
            <Flex
              sx={{ flexDirection: 'column', flexBasis: '50%', mt: 2, mb: 6 }}
            >
              <Heading data-cy="library-contributions" as="h3" variant="small">
                Library
              </Heading>
              {docs.projects.map((item) => {
                return (
                  <UserCreatedDocumentsItem
                    key={item.id}
                    type="library"
                    item={{
                      id: item.id!,
                      slug: item.slug!,
                      title: item.title!,
                      usefulVotes: item.usefulCount || 0,
                    }}
                  />
                )
              })}
            </Flex>
          )}
          {docs?.research.length > 0 && (
            <Flex my={2} sx={{ flexDirection: 'column', flexBasis: '50%' }}>
              <Heading as="h3" variant="small">
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
          {docs?.questions.length > 0 && (
            <Flex
              data-testid="question-contributions"
              sx={{ flexDirection: 'column', flexBasis: '50%' }}
            >
              <Heading as="h3" variant="small">
                Questions
              </Heading>
              {docs?.questions.map((item) => {
                return (
                  <UserCreatedDocumentsItem
                    key={item.id}
                    type="questions"
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
