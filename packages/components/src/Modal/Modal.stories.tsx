import type { StoryFn, Meta } from '@storybook/react'
import { Modal } from './Modal'

export default {
  title: 'Components/Modal',
  component: Modal,
} as Meta<typeof Modal>

const dismissed = () => alert('Dismissed')

export const Default: StoryFn<typeof Modal> = () => (
  <Modal isOpen={true} onDidDismiss={dismissed}>
    <>Some Content</>
  </Modal>
)

export const Collapsed: StoryFn<typeof Modal> = () => <Modal isOpen={false} />

export const Sized: StoryFn<typeof Modal> = () => (
  <Modal isOpen={true} onDidDismiss={dismissed} height={100} width={100}>
    <>Sized Modal</>
  </Modal>
)
