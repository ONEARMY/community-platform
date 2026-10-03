import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBComment, DBProfile } from 'oa-shared';
import { data, type LoaderFunctionArgs, type Params } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { isUserAdmin } from 'src/utils/isAdmin';

type Supabase = {
  headers: Headers;
  client: SupabaseClient<any, 'public', any>;
};

export async function action({ params, request }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  const headers = supabase.headers;
  const claims = await supabase.client.auth.getClaims();

  if (!claims.data?.claims) {
    return data({}, { headers, status: 401 });
  }

  const { valid, status, statusText } = await validateRequest(params, request);

  if (!valid) {
    return data({}, { headers, status, statusText });
  }

  const profile = await getProfileByAuthId(request, claims.data.claims.sub);

  if (!profile) {
    return data({}, { headers, status: 400, statusText: 'user not found' });
  }

  if (!profile.username) {
    return data(
      { error: 'You must set a username before modifying comments' },
      { headers, status: 403 },
    );
  }

  const commentId: string = params.id!;

  try {
    if (request.method === 'DELETE') {
      return await deleteComment(supabase, commentId, params.sourceId!, profile);
    }

    return await updateComment(supabase, request, commentId, params.sourceId!, profile);
  } catch (error) {
    logger.error(error);
    return data({ error: 'Could not modify comment' }, { headers, status: 500 });
  }
}

async function updateComment(
  { client, headers }: Supabase,
  request: Request,
  id: string,
  sourceId: string,
  user: DBProfile,
) {
  const json = await request.json().catch(() => null);

  if (typeof json?.comment !== 'string' || !json.comment.trim()) {
    return data({}, { headers, status: 400, statusText: 'comment is required' });
  }

  const { data: commentData, error } = await client
    .from('comments')
    .select()
    .eq('id', id)
    .eq('source_id', sourceId)
    .single();

  if (error || !commentData) {
    return data({}, { headers, status: 404, statusText: 'comment not found' });
  }

  const comment = commentData as DBComment;

  if (comment.created_by !== user.id && !isUserAdmin(user)) {
    return data({}, { headers, status: 403, statusText: 'forbidden' });
  }

  const result = await client.from('comments').update({ comment: json.comment }).eq('id', id);

  if (result.error) {
    logger.error(result.error);
    return data({}, { headers, status: 500, statusText: 'Error updating comment' });
  }

  new ProfileServiceServer(client).updateUserActivity(user.auth_id);

  return new Response(null, { headers, status: 204 });
}

async function deleteComment(
  { client, headers }: Supabase,
  id: string,
  sourceId: string,
  user: DBProfile,
) {
  const { data: commentData, error } = await client
    .from('comments')
    .select()
    .eq('id', id)
    .eq('source_id', sourceId)
    .single();

  if (error || !commentData) {
    return data({}, { headers, status: 404, statusText: 'comment not found' });
  }

  const comment = commentData as DBComment;

  if (comment.created_by !== user.id && !isUserAdmin(user)) {
    return data({}, { headers, status: 403, statusText: 'forbidden' });
  }

  const result = await client.from('comments').update({ deleted: true }).eq('id', id);

  if (result.error) {
    logger.error(result.error);
    return data({}, { headers, status: 500, statusText: 'Error deleting comment' });
  }

  new ProfileServiceServer(client).updateUserActivity(user.auth_id);

  return new Response(null, { headers, status: 204 });
}

async function getProfileByAuthId(request: Request, authId: string) {
  const { client } = createSupabaseServerClient(request);

  const { data: profileData, error } = await client
    .from('profiles')
    .select()
    .eq('auth_id', authId)
    .limit(1);

  if (error || !profileData?.at(0)) {
    return null;
  }

  return profileData[0] as DBProfile;
}

async function validateRequest(params: Params<string>, request: Request) {
  if (!params.sourceId) {
    return { status: 400, statusText: 'sourceId is required' };
  }

  if (!params.id) {
    return { status: 400, statusText: 'id is required' };
  }

  if (request.method !== 'PUT' && request.method !== 'DELETE') {
    return { status: 405, statusText: 'method not allowed' };
  }

  return { valid: true };
}
