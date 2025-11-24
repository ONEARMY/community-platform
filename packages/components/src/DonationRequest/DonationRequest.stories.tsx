import { DonationRequest } from './DonationRequest';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/DonationRequest',
  component: DonationRequest,
} as Meta<typeof DonationRequest>;

export const Default: StoryFn<typeof DonationRequest> = () => (
  <div style={{ maxWidth: '1000px' }}>
    <DonationRequest
      body="All of the content here is free. Your donation supports this library of Open Source recycling knowledge. Making it possible for everyone in the world to use it and start recycling."
      iframeSrc="https://donorbox.org/embed/ppcpdonor?language=en"
      imageURL="https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9"
    />
  </div>
);
