import { PollDTO } from 'oa-shared/models/poll';

const voteOnPoll = async (poll: PollDTO, selectedIds: number[]) => {
  try {
    await fetch(`/api/polls/${poll.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optionIds: selectedIds,
      }),
    });
  } catch (error) {
    console.error({ error });
  }
};

const getPoll = async (poll: PollDTO) => {
  try {
    const response = await fetch(`/api/polls/${poll.id}`);
    const data: PollDTO | null = await response.json();
    return data;
  } catch (error) {
    console.error({ error });
  }
  return null;
};

export const pollService = {
  voteOnPoll,
  getPoll,
};
