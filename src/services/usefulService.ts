import type { UsefulContentType, UsefulVoter } from 'oa-shared';

const add = async (contentType: UsefulContentType, id: number) => {
  return await fetch(`/api/useful/${contentType}/${id}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};

const remove = async (contentType: UsefulContentType, id: number) => {
  return await fetch(`/api/useful/${contentType}/${id}`, {
    method: 'DELETE',
  });
};

const hasVoted = async (contentType: UsefulContentType, id: number) => {
  try {
    const response = await fetch(`/api/useful/${contentType}/${id}/voted`);

    const { voted } = await response.json();

    return !!voted;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const usefulVoters = async (contentType: UsefulContentType, id: number): Promise<UsefulVoter[]> => {
  try {
    const response = await fetch(`/api/useful/${contentType}/${id}/users`);

    const users = await response.json();

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const usefulService = {
  add,
  remove,
  hasVoted,
  usefulVoters,
};
