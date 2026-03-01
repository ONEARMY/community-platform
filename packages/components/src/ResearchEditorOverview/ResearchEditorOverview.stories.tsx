import { ResearchEditorOverview } from './ResearchEditorOverview';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ResearchEditorOverview> = {
  title: 'Layout/ResearchEditorOverview',
  component: ResearchEditorOverview,
};
export default meta;

type Story = StoryObj<typeof ResearchEditorOverview>;

export const Default: Story = {
  args: {
    updates: [
      { isActive: true, title: 'Update 1', id: 1, isDraft: false },
      { isActive: false, title: 'Update 2', id: 2, isDraft: false },
      { isActive: false, title: 'Update 3', id: 3, isDraft: false },
    ],
    researchSlug: 'abc',
    showBackToResearchButton: true,
    showCreateUpdateButton: true,
  },
};

export const ShowBackToResearchButton: Story = {
  args: {
    ...Default.args,
    showBackToResearchButton: true,
  },
};

export const ShowCreateUpdateButton: Story = {
  args: {
    ...Default.args,
    showCreateUpdateButton: true,
  },
};

export const DraftItem: Story = {
  args: {
    ...Default.args,
    updates: [
      { isActive: false, title: 'Update 1', id: 1, isDraft: true },
    ],
  },
};