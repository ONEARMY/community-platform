import { useState } from 'react';

import { DonationRequestModal } from './DonationRequestModal';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/DonationRequestModal',
  component: DonationRequestModal,
} as Meta<typeof DonationRequestModal>;

export const Default: StoryFn<typeof DonationRequestModal> = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const toggleIsModalOpen = () => setIsModalOpen(!isModalOpen);

  return (
    <DonationRequestModal
      body="All of the content here is free. Your donation supports this library of Open Source recycling knowledge. Making it possible for everyone in the world to use it and start recycling."
      iframeSrc="https://donorbox.org/embed/ppcpdonor?language=en"
      imageURL="https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9"
      isOpen={isModalOpen}
      onDidDismiss={() => toggleIsModalOpen()}
    />
  );
};
