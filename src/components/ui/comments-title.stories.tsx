import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Comment } from 'oa-shared';
import { CommentsTitle } from '@/components/ui/comments-title';

const comment = {} as Comment;

const meta: Meta<typeof CommentsTitle> = {
  title: 'ui/CommentsTitle',
  component: CommentsTitle,
};
export default meta;

type Story = StoryObj<typeof CommentsTitle>;

export const NoComments: Story = { args: { comments: [] } };

export const OneComment: Story = { args: { comments: [comment] } };

export const MultipleComments: Story = { args: { comments: [comment, comment, comment] } };

export const CustomNoun: Story = { args: { comments: [comment, comment], noun: 'Answers' } };
