import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DBResearchItem,
  ResearchItem,
  ResearchUpdate,
  SubscribableContentTypes,
} from 'oa-shared';

const combineSubscribers = async (
  ids: (number | null | undefined)[],
  usernames: string[],
  client: SupabaseClient,
): Promise<number[]> => {
  const profilesToSubscribe: number[] = ids.map((id) => Number(id));

  for (const username of usernames) {
    const { data } = await client.from('profiles').select('id').eq('username', username).single();
    if (data && !!Number(data.id)) {
      profilesToSubscribe.push(Number(data.id));
    }
  }

  const uniqueIdSet = new Set([...profilesToSubscribe]);

  return [...uniqueIdSet];
};

const addResearchSubscribers = async (
  research: ResearchItem,
  profileId: number,
  client: SupabaseClient,
  headers: Headers,
  addFunction = add,
) => {
  const subscribers = await combineSubscribers(
    [profileId],
    research.collaboratorsUsernames || [],
    client,
  );
  return Promise.all([
    subscribers.map((subscriber) => {
      addFunction('research', research.id, subscriber, client, headers);
    }),
  ]);
};

const addResearchUpdateSubscribers = async (
  update: ResearchUpdate,
  profileId: number,
  client: SupabaseClient,
  headers: Headers,
  addFunction = add,
) => {
  const subscribers = await combineSubscribers(
    [profileId, update.research?.created_by],
    update.research?.collaborators || [],
    client,
  );
  return Promise.all([
    subscribers.map((subscriber) => {
      addFunction('research_update', update.id, subscriber, client, headers);
    }),
  ]);
};

const add = async (
  contentType: SubscribableContentTypes,
  contentId: number,
  profileId: number,
  client: SupabaseClient,
  headers: Headers,
) => {
  try {
    const response = await client
      .from('subscribers')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .eq('user_id', profileId)
      .single();

    if (response.data) {
      return Response.json({}, { headers, status: 200 });
    }

    await client.from('subscribers').insert({
      content_type: contentType,
      content_id: contentId,
      user_id: profileId,
      tenant_id: process.env.TENANT_ID!,
    });
    return Response.json({}, { headers, status: 200 });
  } catch (error) {
    if (error) {
      console.error(error);
      return Response.json({}, { headers, status: 500, statusText: 'error' });
    }
  }
};

const updateResearchSubscribers = async (
  oldResearch: DBResearchItem,
  newResearch: ResearchItem,
  client: SupabaseClient,
  headers: Headers,
  addFunction = add,
) => {
  const oldCollaborators = oldResearch.collaborators || [];
  const newCollaborators = newResearch.collaboratorsUsernames || [];

  const newCollaboratorUsernames = newCollaborators.filter(
    (username) => !oldCollaborators.includes(username),
  );

  if (newCollaboratorUsernames.length === 0) {
    return;
  }

  const subscribers = await combineSubscribers([], newCollaboratorUsernames, client);
  return Promise.all([
    subscribers.map((subscriber) => {
      addFunction('research', newResearch.id, subscriber, client, headers);
    }),
  ]);
};

export const subscribersServiceServer = {
  addResearchSubscribers,
  addResearchUpdateSubscribers,
  add,
  updateResearchSubscribers,
};
