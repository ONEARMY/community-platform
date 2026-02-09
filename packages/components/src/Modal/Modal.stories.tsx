import { Modal } from './Modal';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Layout/Modal',
  component: Modal,
} as Meta<typeof Modal>;

const dismissed = () => alert('Dismissed');

export const Default: StoryFn<typeof Modal> = () => (
  <Modal isOpen={true} onDismiss={dismissed}>
    Some Content
  </Modal>
);

export const Collapsed: StoryFn<typeof Modal> = () => (
  <Modal isOpen={false} onDismiss={() => {}}>
    Collapsed
  </Modal>
);

export const Sized: StoryFn<typeof Modal> = () => (
  <Modal isOpen={true} onDismiss={dismissed} height={100} width={100}>
    Sized Modal
  </Modal>
);
