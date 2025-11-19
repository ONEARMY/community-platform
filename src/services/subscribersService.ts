import type { SubscribableContentTypes } from 'oa-shared';

const add = async (contentType: SubscribableContentTypes, id: number) => {
  return await fetch(`/api/subscribers/${contentType}/${id}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};

const remove = async (contentType: SubscribableContentTypes, id: number) => {
  return await fetch(`/api/subscribers/${contentType}/${id}`, {
    method: 'DELETE',
  });
};

const isSubscribed = async (contentType: SubscribableContentTypes, id: number) => {
  try {
    const response = await fetch(`/api/subscribers/${contentType}/${id}/subscribed`);

    const { subscribed } = await response.json();

    return !!subscribed;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const subscribersService = {
  add,
  remove,
  isSubscribed,
};
