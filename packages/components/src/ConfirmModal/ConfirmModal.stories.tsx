import { ConfirmModal } from './ConfirmModal'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Layout/ConfirmModal',
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
