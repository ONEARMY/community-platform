import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ResearchEditorOverview } from './ResearchEditorOverview'

export default {
  title: 'Components/ResearchEditorOverview',
  component: ResearchEditorOverview,
} as ComponentMeta<typeof ResearchEditorOverview>

export const Default: ComponentStory<typeof ResearchEditorOverview> = () => (
  <ResearchEditorOverview
    updates={[
      {
        isActive: true,
        title: 'Update 1',
        slug: 'update-1',
      },
      {
        isActive: false,
        title: 'Update 2',
        slug: 'update-2',
      },
      {
        isActive: false,
        title: 'Update 3',
        slug: 'update-3',
      },
    ]}
    researchSlug={'abc'}
    showBackToResearchButton
    showCreateUpdateButton
  />
)
