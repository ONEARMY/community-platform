import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './button';
import { ConfirmModal, type ConfirmModalProps } from './confirm-modal';

const meta: Meta<typeof ConfirmModal> = {
  title: 'ui/ConfirmModal',
  component: ConfirmModal,
};
export default meta;

type Story = StoryObj<typeof ConfirmModal>;

function ConfirmModalHarness(props: Partial<ConfirmModalProps>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open confirm modal</Button>
      <ConfirmModal
        message={props.message ?? 'Are you sure you want to delete this?'}
        confirmButtonText={props.confirmButtonText ?? 'Delete'}
        confirmVariant={props.confirmVariant}
        cancelVariant={props.cancelVariant}
        checkboxLabel={props.checkboxLabel}
        width={props.width}
        isOpen={isOpen}
        handleCancel={() => setIsOpen(false)}
        handleConfirm={() => setIsOpen(false)}
      >
        {props.children}
      </ConfirmModal>
    </div>
  );
}

export const Default: Story = {
  render: () => <ConfirmModalHarness />,
};

export const Destructive: Story = {
  render: () => (
    <ConfirmModalHarness
      message="Are you sure you want to delete this Project?"
      confirmButtonText="Delete"
      confirmVariant="destructive"
    />
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <ConfirmModalHarness
      message="Ban this user?"
      confirmButtonText="Ban user"
      confirmVariant="destructive"
      checkboxLabel="I understand this action cannot be undone"
      width={500}
    />
  ),
};

export const WithChildren: Story = {
  render: () => (
    <ConfirmModalHarness message="Leave this page?" confirmButtonText="Yes">
      <p className="text-muted-foreground">
        You have unsaved changes that will be lost if you leave.
      </p>
    </ConfirmModalHarness>
  ),
};
