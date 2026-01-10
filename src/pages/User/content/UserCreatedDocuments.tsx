import { Flex, Grid, Heading } from 'theme-ui';

import UserCreatedDocumentsItem from './UserCreatedDocumentsItem';

import type { UserCreatedDocs } from 'oa-shared';

interface IProps {
  columns: number;
  docs: UserCreatedDocs;
}

const UserCreatedDocuments = ({ columns, docs }: IProps) => {
  return (
    <>
      {(docs.projects.length > 0 || docs.research.length > 0 || docs.questions.length > 0) && (
        <Grid columns={[1, 1, columns]} gap={5}>
          {docs?.projects.length > 0 && (
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
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
                      usefulCount: item.usefulCount || 0,
                    }}
                  />
                );
              })}
            </Flex>
          )}
          {docs?.research.length > 0 && (
            <Flex data-testid="research-contributions" sx={{ flexDirection: 'column', gap: 2 }}>
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
                      usefulCount: item.usefulCount || 0,
                    }}
                  />
                );
              })}
            </Flex>
          )}
          {docs?.questions.length > 0 && (
            <Flex data-testid="question-contributions" sx={{ flexDirection: 'column', gap: 2 }}>
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
                      usefulCount: item.usefulCount || 0,
                    }}
                  />
                );
              })}
            </Flex>
          )}
        </Grid>
      )}
    </>
  );
};

export default UserCreatedDocuments;
