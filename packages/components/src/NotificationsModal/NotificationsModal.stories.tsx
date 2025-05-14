import { NotificationsModal } from './NotificationsModal'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/Modal',
  component: NotificationsModal,
} as Meta<typeof NotificationsModal>

const dismissed = () => alert('Dismissed')

export const Default: StoryFn<typeof NotificationsModal> = () => (
  <NotificationsModal isOpen={true} onDidDismiss={dismissed}>
    <>Some Content</>
  </NotificationsModal>
)
