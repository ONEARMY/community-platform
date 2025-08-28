import { EditComment } from './EditComment'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Commenting/EditComment',
  component: EditComment,
} as Meta<typeof EditComment>

export const Default: StoryFn<typeof EditComment> = () => (
  <EditComment
    isReply={false}
    comment="A short comment"
    setShowEditModal={() => null}
    handleCancel={() => null}
    handleSubmit={() => Promise.resolve(new Response(''))}
  />
)

export const EditReply: StoryFn<typeof EditComment> = () => (
  <EditComment
    isReply={true}
    comment="A short comment here..."
    setShowEditModal={() => null}
    handleCancel={() => null}
    handleSubmit={() => Promise.resolve(new Response(''))}
  />
)
