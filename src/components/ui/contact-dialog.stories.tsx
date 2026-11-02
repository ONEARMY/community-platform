import type { Meta, StoryObj } from '@storybook/react-vite';
import type { PinProfile } from 'oa-shared';
import { ProfileStoreProvider } from '@/stores/Profile/profile.store';
import { Button } from './button';
import { ContactDialog } from './contact-dialog';

const user = {
  displayName: 'Alex Example',
  username: 'alex-example',
  isContactable: true,
} as PinProfile;

const meta: Meta<typeof ContactDialog> = {
  title: 'ui/ContactDialog',
  component: ContactDialog,
};
export default meta;

type Story = StoryObj<typeof ContactDialog>;

export const Default: Story = {
  render: () => (
    <ProfileStoreProvider>
      <ContactDialog open={true} onOpenChange={() => {}} user={user} />
      <Button>Contact Alex Example</Button>
    </ProfileStoreProvider>
  ),
};
