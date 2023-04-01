import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { ConfirmModal } from './ConfirmModal'

export default {
  title: 'Components/ConfirmModal',
  component: ConfirmModal,
} as ComponentMeta<typeof ConfirmModal>

export const Default: ComponentStory<typeof ConfirmModal> = () => (
  <ConfirmModal
    message="Are you sure you want to delete this item?"
    confirmButtonText="Delete"
    isOpen={true}
    handleCancel={() => null}
    handleConfirm={() => null}
  />
)
