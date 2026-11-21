import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { UserEngagementWrapper } from '@/components/ui/user-engagement-wrapper';

const meta: Meta<typeof UserEngagementWrapper> = {
  title: 'ui/UserEngagementWrapper',
  component: UserEngagementWrapper,
};
export default meta;

type Story = StoryObj<typeof UserEngagementWrapper>;

export const Default: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl">
      <UserEngagementWrapper>
        <div className="m-4 flex justify-center gap-2">
          <Button>Leave a comment</Button>
          <Button>Mark as useful</Button>
        </div>
      </UserEngagementWrapper>
    </div>
  ),
};