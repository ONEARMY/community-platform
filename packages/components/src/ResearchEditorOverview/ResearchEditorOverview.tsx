import { Card, Heading, Box, Text } from 'theme-ui'
import type { ThemeUIStyleObject } from 'theme-ui'
import { InternalLink } from '../InternalLink/InternalLink'
import { Button } from '../Button/Button'

type Update = {
  isActive: boolean
  title: string
  slug: string | null
}

export interface ResearchEditorOverviewProps {
  updates: Update[]
  researchSlug: string
  newItemTitle?: string
  showCreateUpdateButton?: boolean
  showBackToResearchButton?: boolean
  sx?: ThemeUIStyleObject
}

export const ResearchEditorOverview = (props: ResearchEditorOverviewProps) => {
  const {
    updates,
    sx,
    researchSlug,
    showCreateUpdateButton,
    showBackToResearchButton,
  } = props
  return (
    <Card sx={{ p: 4, ...sx }}>
      <Heading as="h3" mb={3} variant="small">
        Research overview
      </Heading>
      <Box as={'ul'} sx={{ margin: 0, mb: 4, p: 0, pl: 3 }}>
        {updates.map((update, index) => (
          <Box as={'li'} key={index} sx={{ mb: 1 }}>
            <Text variant={'quiet'}>
              {update.isActive ? (
                <strong>{update.title}</strong>
              ) : (
                <>
                  {update.title}
                  {update.slug ? (
                    <InternalLink
                      to={`/research/${researchSlug}/edit-update/${update.slug}`}
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
      {showCreateUpdateButton ? (
        <Button small sx={{ mr: 2 }}>
          <InternalLink
            to={`/research/${researchSlug}/new-update`}
            sx={{ color: 'black' }}
          >
            Create update
          </InternalLink>
        </Button>
      ) : null}

      {showBackToResearchButton ? (
        <Button small variant={'outline'}>
          <InternalLink
            to={`/research/${researchSlug}/edit`}
            sx={{ color: 'black' }}
          >
            Back to research
          </InternalLink>
        </Button>
      ) : null}
    </Card>
  )
}
