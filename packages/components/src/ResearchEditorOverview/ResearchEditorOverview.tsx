import { Box, Card, Heading, Text } from 'theme-ui';
import { Button } from '../Button/Button';
import { InternalLink } from '../InternalLink/InternalLink';

export type ResearchEditorOverviewUpdate = {
  isActive: boolean;
  title: string;
  isDraft: boolean;
  id: number | null;
};

export interface ResearchEditorOverviewProps {
  updates: ResearchEditorOverviewUpdate[];
  researchSlug: string;
  newItemTitle?: string;
  showCreateUpdateButton?: boolean;
  showBackToResearchButton?: boolean;
}

export const ResearchEditorOverview = (props: ResearchEditorOverviewProps) => {
  const { updates, researchSlug, showCreateUpdateButton, showBackToResearchButton } = props;
  return (
    <Card sx={{ padding: 4 }}>
      <Heading as="h2" mb={3} variant="small">
        Research overview
      </Heading>
      {updates?.length ? (
        <Box as="ul" sx={{ margin: 0, marginBottom: 4, padding: 0, paddingLeft: 3 }}>
          {updates.map((update, index) => (
            <Box as="li" key={index} sx={{ marginBottom: 1 }}>
              <Text variant={'quiet'}>
                {update.isDraft ? (
                  <Text
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      color: 'black',
                      fontSize: 1,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      background: 'accent',
                      padding: 1,
                      borderRadius: 1,
                      borderBottomRightRadius: 1,
                      mr: 1,
                    }}
                  >
                    Draft
                  </Text>
                ) : null}
                {update.isActive ? (
                  <strong>{update.title}</strong>
                ) : (
                  <>
                    {update.title}
                    {update.id ? (
                      <InternalLink
                        to={`/research/${researchSlug}/edit-update/${update.id}`}
                        sx={{ display: 'inline-block', ml: 1 }}
                      >
                        Edit
                      </InternalLink>
                    ) : null}
                  </>
                )}
              </Text>
            </Box>
          ))}
        </Box>
      ) : null}
      {showCreateUpdateButton ? (
        <InternalLink to={`/research/${researchSlug}/new-update`} sx={{ mr: 2 }}>
          <Button small data-cy="create-update" type="button" sx={{ color: 'black' }}>
            Create update
          </Button>
        </InternalLink>
      ) : null}

      {showBackToResearchButton ? (
        <InternalLink to={`/research/${researchSlug}/edit`}>
          <Button small variant="outline" type="button" sx={{ color: 'black' }}>
            Back to research
          </Button>
        </InternalLink>
      ) : null}
    </Card>
  );
};
