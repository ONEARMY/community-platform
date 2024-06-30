import { EditComment } from './EditComment'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/EditComment',
  component: EditComment,
} as Meta<typeof EditComment>

export const Default: StoryFn<typeof EditComment> = () => (
  <EditComment
    isReply={false}
    comment="A short comment"
    handleCancel={() => null}
    handleSubmit={() => null}
  />
)

export const EditReply: StoryFn<typeof EditComment> = () => (
  <EditComment
    isReply={true}
    comment="A short comment here..."
    handleCancel={() => null}
    handleSubmit={() => null}
  />
)
