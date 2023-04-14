import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ResearchEditorOverview } from './ResearchEditorOverview'

export default {
  title: 'Components/ResearchEditorOverview',
  component: ResearchEditorOverview,
} as ComponentMeta<typeof ResearchEditorOverview>

export const Default: ComponentStory<typeof ResearchEditorOverview> = () => (
  <ResearchEditorOverview updates={[]} researchSlug={'abc'} />
)
