import type { StoryFn, Meta } from '@storybook/react'
import { EditComment } from './EditComment'

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
