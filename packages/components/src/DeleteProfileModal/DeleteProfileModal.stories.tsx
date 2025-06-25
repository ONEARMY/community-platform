import { DeleteProfileModal } from './DeleteProfileModal'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/DeleteProfileModal',
  component: DeleteProfileModal,
} as Meta<typeof DeleteProfileModal>

export const Default: StoryFn<typeof DeleteProfileModal> = () => (
  <DeleteProfileModal
    message="Are you sure you want to delete this item?"
    isOpen={true}
    handleCancel={() => null}
    handleConfirm={() => null}
  />
)
