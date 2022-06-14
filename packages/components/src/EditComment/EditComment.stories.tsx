import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { EditComment } from './EditComment'

export default {
  title: 'Base Components/EditComment',
  component: EditComment,
} as ComponentMeta<typeof EditComment>

export const Default: ComponentStory<typeof EditComment> = () => (
  <EditComment
    comment="A short comment"
    handleCancel={() => null}
    handleSubmit={() => null}
  />
)
