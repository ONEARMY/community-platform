import { ConfirmModalWithForm } from './ConfirmModalWithForm'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/ConfirmModalWithForm',
  component: ConfirmModalWithForm,
} as Meta<typeof ConfirmModalWithForm>

export const Default: StoryFn<typeof ConfirmModalWithForm> = () => (
  <ConfirmModalWithForm
    message="Are you sure you want to delete this item?"
    confirmButtonText="Delete"
    isOpen={true}
    handleCancel={() => null}
    handleConfirm={() => null}
  />
)
