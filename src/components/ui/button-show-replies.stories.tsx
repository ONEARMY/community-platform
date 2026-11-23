import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Comment } from 'oa-shared';
import { useState } from 'react';
import { ButtonShowReplies } from '@/components/ui/button-show-replies';

const fakeReplies = (count: number) =>
  Array.from({ length: count }, (_, id) => ({ id, deleted: false }) as Comment);

const meta: Meta<typeof ButtonShowReplies> = {
  title: 'ui/ButtonShowReplies',
  component: ButtonShowReplies,
};
export default meta;

type Story = StoryObj<typeof ButtonShowReplies>;

export const Default: Story = {
  render: () => {
    const [isShowReplies, setIsShowReplies] = useState(false);

    return (
      <ButtonShowReplies
        replies={fakeReplies(7)}
        isShowReplies={isShowReplies}
        setIsShowReplies={() => setIsShowReplies(!isShowReplies)}
      />
    );
  },
};

export const RepliesShowing: Story = {
  args: { isShowReplies: true, replies: fakeReplies(6), setIsShowReplies: () => null },
};

export const OneReply: Story = {
  args: { isShowReplies: false, replies: fakeReplies(1), setIsShowReplies: () => null },
};

export const NoReplies: Story = {
  args: { isShowReplies: false, replies: [], setIsShowReplies: () => null },
};
