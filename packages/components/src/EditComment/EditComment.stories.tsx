import { EditComment } from './EditComment'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/EditComment',
  component: EditComment,
} as Meta<typeof EditComment>

export const Default: StoryFn<typeof EditComment> = () => (
  <EditComment
    comment="A short comment"
    handleCancel={() => null}
    handleSubmit={() => null}
  />
)
