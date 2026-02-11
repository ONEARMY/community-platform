import { max } from 'date-fns';
import { AuthorDisplay, Category, DisplayDate, LinkifyText, TagList, Username } from 'oa-components';
import { type ResearchItem, ResearchStatusRecord } from 'oa-shared';
import { useMemo } from 'react';
import { DraftTag } from 'src/pages/common/Drafts/DraftTag';
import { Card, Divider, Flex, Heading, Text } from 'theme-ui';
import { researchStatusColour } from '../researchHelpers';
import ResearchFooter from './ResearchFooter';

interface IProps {
  research: ResearchItem;
}

const ResearchDescription = (props: IProps) => {
  const { research } = props;

  const lastUpdated = useMemo(() => {
    const dates = [research?.modifiedAt, ...(research?.updates?.map((update) => update?.modifiedAt) || [])]
      .filter((date): date is Date => date !== null)
      .map((date) => new Date(date));

    return dates.length > 0 ? max(dates) : new Date();
  }, [research]);

  const hasContributors = research.collaborators && research.collaborators.length;

  return (
    <Card variant="responsive">
      <Flex
        data-cy="research-basis"
        data-id={research.id}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          gap: 4,
          padding: [2, 4],
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          {research.deleted && (
            <Text color="red" pl={2} mb={2} data-cy="research-deleted">
              * Marked for deletion
            </Text>
          )}

          <Heading as="h1" data-testid="research-title">
            {research.title}
          </Heading>

          <Flex
            sx={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <AuthorDisplay author={research.author} />

            {hasContributors ? (
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Text variant="auxiliary" sx={{ color: 'lightgrey' }}>
                  With contributions from
                </Text>
                {research.collaborators.map((contributor, key) => (
                  <Username key={key} user={contributor} />
                ))}
              </Flex>
            ) : null}

            {research.isDraft && <DraftTag />}

            <Text variant="auxiliary">
              <DisplayDate createdAt={research.createdAt}
                publishedAt={research.publishedAt} modifiedAt={lastUpdated.toISOString()} publishedAction="Started" />
            </Text>

            {research.category && <Category category={research.category} sx={{ fontSize: 2 }} />}

            <Flex
              sx={{
                borderRadius: 1,
                background: researchStatusColour(research.status),
              }}
            >
              <Text
                sx={{
                  fontSize: '14px',
                  paddingX: 2,
                  paddingY: 1,
                }}
              >
                {research.status ? ResearchStatusRecord[research.status] : 'In progress'}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
          <LinkifyText>{research.description}</LinkifyText>
        </Text>

        <TagList tags={research.tags.map((t) => ({ label: t.name }))} />
      </Flex>

      <Divider sx={{ border: '1px solid black', margin: 0 }} />

      <ResearchFooter research={research} />
    </Card>
  );
};

export default ResearchDescription;
