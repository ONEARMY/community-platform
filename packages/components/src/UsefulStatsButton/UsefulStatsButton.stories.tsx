import { useState } from 'react';

import { UsefulStatsButton } from './UsefulStatsButton';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/UsefulStatsButton',
  component: UsefulStatsButton,
} as Meta<typeof UsefulStatsButton>;

export const LoggedOutWithCount: StoryFn<typeof UsefulStatsButton> = () => (
  <UsefulStatsButton
    isLoggedIn={false}
    hasUserVotedUseful={false}
    onUsefulClick={() => Promise.resolve()}
  />
);

export const LoggedInWithCount: StoryFn<typeof UsefulStatsButton> = () => {
  const [voted, setVoted] = useState(false);

  const clickVote = async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
    setVoted((val) => !val);
  };

  return (
    <UsefulStatsButton hasUserVotedUseful={voted} isLoggedIn={true} onUsefulClick={clickVote} />
  );
};

export const CurrentUserHasVoted: StoryFn<typeof UsefulStatsButton> = () => {
  const [voted, setVoted] = useState(true);

  const clickVote = async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
    setVoted((val) => !val);
  };

  return (
    <UsefulStatsButton hasUserVotedUseful={voted} isLoggedIn={true} onUsefulClick={clickVote} />
  );
};
