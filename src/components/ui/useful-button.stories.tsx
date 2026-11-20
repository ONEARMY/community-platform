import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { UsefulButton, type UsefulButtonProps } from './useful-button';

const meta = {
  title: 'ui/UsefulButton',
  component: UsefulButton,
  args: {
    isLoggedIn: true,
    hasUserVotedUseful: false,
    onUsefulClick: async () => {},
  },
} satisfies Meta<typeof UsefulButton>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveUsefulButton({
  delay = 0,
  reject = false,
  ...props
}: UsefulButtonProps & { delay?: number; reject?: boolean }) {
  const [hasVoted, setHasVoted] = useState(props.hasUserVotedUseful);

  return (
    <UsefulButton
      {...props}
      hasUserVotedUseful={hasVoted}
      onUsefulClick={async () => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (reject) {
          throw new Error('Unable to save vote');
        }
        setHasVoted((value) => !value);
      }}
    />
  );
}

export const LoggedOut: Story = {
  args: { isLoggedIn: false },
};

export const Unselected: Story = {
  render: (args) => <InteractiveUsefulButton {...args} />,
};

export const Selected: Story = {
  args: { hasUserVotedUseful: true },
  render: (args) => <InteractiveUsefulButton {...args} />,
};

export const Pending: Story = {
  render: (args) => <InteractiveUsefulButton {...args} delay={2000} />,
};

export const RejectedRequest: Story = {
  render: (args) => <InteractiveUsefulButton {...args} delay={1000} reject />,
};
