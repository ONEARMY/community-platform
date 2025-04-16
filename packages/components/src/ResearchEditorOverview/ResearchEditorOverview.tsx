import { Box, Card, Heading, Text } from 'theme-ui'
import { boolean, object, string } from 'yup'

import { Button } from '../Button/Button'
import { InternalLink } from '../InternalLink/InternalLink'

import type { ThemeUIStyleObject } from 'theme-ui'

export type ResearchEditorOverviewUpdate = {
  isActive: boolean
  title: string
  isDraft: boolean
  id: number | null
}

export interface ResearchEditorOverviewProps {
  updates: ResearchEditorOverviewUpdate[]
  researchSlug: string
  newItemTitle?: string
  showCreateUpdateButton?: boolean
  showBackToResearchButton?: boolean
  sx?: ThemeUIStyleObject
}

const updateSchema = object({
  isActive: boolean().required(),
  title: string().required(),
  status: string().optional(),
  slug: string().nullable(),
})

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
      <Heading as="h2" mb={3} variant="small">
        Research overview
      </Heading>
      {updates?.length ? (
        <Box as={'ul'} sx={{ margin: 0, mb: 4, p: 0, pl: 3 }}>
          {updates
            .filter((update) => updateSchema.isValidSync(update))
            .map((update, index) => (
              <Box as={'li'} key={index} sx={{ mb: 1 }}>
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
                        background: 'accent.base',
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
        <Button small sx={{ mr: 2 }} data-cy="create-update" type="button">
          <InternalLink
            to={`/research/${researchSlug}/new-update`}
            sx={{ color: 'black' }}
          >
            Create update
          </InternalLink>
        </Button>
      ) : null}

      {showBackToResearchButton ? (
        <Button small variant="outline" type="button">
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
