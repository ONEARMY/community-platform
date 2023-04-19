import type { StoryFn, Meta } from '@storybook/react'
import { ConfirmModal } from './ConfirmModal'

export default {
  title: 'Components/ConfirmModal',
  component: ConfirmModal,
} as Meta<typeof ConfirmModal>

export const Default: StoryFn<typeof ConfirmModal> = () => (
  <ConfirmModal
    message="Are you sure you want to delete this item?"
    confirmButtonText="Delete"
    isOpen={true}
    handleCancel={() => null}
    handleConfirm={() => null}
  />
)
