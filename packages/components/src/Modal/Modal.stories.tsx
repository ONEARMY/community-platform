import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Modal } from './Modal'

export default {
  title: 'Components/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>

const dismissed = () => alert('Dismissed')

export const Default: ComponentStory<typeof Modal> = () => (
  <Modal isOpen={true} onDidDismiss={dismissed}>
    <>Some Content</>
  </Modal>
)

export const Collapsed: ComponentStory<typeof Modal> = () => (
  <Modal isOpen={false} />
)

export const Sized: ComponentStory<typeof Modal> = () => (
  <Modal isOpen={true} onDidDismiss={dismissed} height={100} width={100}>
    <>Sized Modal</>
  </Modal>
)
