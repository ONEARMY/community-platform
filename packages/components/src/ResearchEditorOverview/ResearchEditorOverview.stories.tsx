import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ResearchEditorOverview } from './ResearchEditorOverview'

export default {
  title: 'Components/ResearchEditorOverview',
  component: ResearchEditorOverview,
} as ComponentMeta<typeof ResearchEditorOverview>

const Template: ComponentStory<typeof ResearchEditorOverview> = (args) => (
  <ResearchEditorOverview {...args} />
)

export const Default = Template.bind({})
Default.args = {
  updates: [
    {
      isActive: true,
      title: 'Update 1',
      slug: 'update-1',
      status: 'published',
    },
    {
      isActive: false,
      title: 'Update 2',
      slug: 'update-2',
      status: 'published',
    },
    {
      isActive: false,
      title: 'Update 3',
      slug: 'update-3',
      status: 'published',
    },
  ],
  researchSlug: 'abc',
  showBackToResearchButton: true,
  showCreateUpdateButton: true,
}

export const ShowBackToResearchButton = Template.bind({})
ShowBackToResearchButton.args = {
  ...Default.args,
  showBackToResearchButton: true,
}

export const ShowCreateUpdateButton = Template.bind({})
ShowCreateUpdateButton.args = {
  ...Default.args,
  showCreateUpdateButton: true,
}

export const DraftItem = Template.bind({})
DraftItem.args = {
  ...Default.args,
  updates: [
    {
      isActive: false,
      title: 'Update 1',
      slug: 'update-1',
      status: 'draft',
    },
  ],
}
