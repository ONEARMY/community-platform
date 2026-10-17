import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './button';
import { EditCommentModal, type EditCommentModalProps } from './edit-comment-modal';

const meta: Meta<typeof EditCommentModal> = {
  title: 'ui/EditCommentModal',
  component: EditCommentModal,
};
export default meta;

type Story = StoryObj<typeof EditCommentModal>;

function EditCommentModalHarness(props: Partial<EditCommentModalProps>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Edit comment</Button>
      <EditCommentModal
        comment={props.comment ?? 'Have you tried a finer mesh on the shredder?'}
        isReply={props.isReply}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={props.onSubmit ?? (async () => new Response(null, { status: 204 }))}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <EditCommentModalHarness />,
};

export const Reply: Story = {
  render: () => <EditCommentModalHarness isReply />,
};

export const SaveError: Story = {
  render: () => (
    <EditCommentModalHarness
      onSubmit={async () => new Response(null, { status: 500, statusText: 'Error updating comment' })}
    />
  ),
};
