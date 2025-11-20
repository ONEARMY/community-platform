import { UserRole } from 'oa-shared';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { updateUserActivity } from 'src/utils/activity.server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBComment, DBProfile } from 'oa-shared';
import type { LoaderFunctionArgs, Params } from 'react-router';

type Supabase = {
  headers: Headers;
  client: SupabaseClient<any, 'public', any>;
};

export async function action({ params, request }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  const headers = supabase.headers;
  const claims = await supabase.client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const { valid, status, statusText } = await validateRequest(params, request);

  if (!valid) {
    return Response.json({}, { headers, status, statusText });
  }

  const profile = await getProfileByAuthId(request, claims.data.claims.sub);

  if (!profile) {
    return Response.json({}, { headers, status: 400, statusText: 'user not found' });
  }

  const commentId: string = params.id!;

  try {
    if (request.method === 'DELETE') {
      return deleteComment(supabase, commentId, profile);
    }

    return updateComment(supabase, request, commentId, profile);
  } catch (error) {
    console.error(error);
    return Response.json(error, { headers });
  }
}

async function updateComment(
  { client, headers }: Supabase,
  request: Request,
  id: string,
  user: DBProfile,
) {
  const json = await request.json();

  if (!json.comment) {
    return Response.json({}, { headers, status: 400, statusText: 'comment is required' });
  }

  const { data, error } = await client.from('comments').select().eq('id', id).single();

  if (error || !data) {
    return Response.json({}, { headers, status: 404, statusText: 'comment not found' });
  }

  const comment = data as DBComment;

  if (comment.created_by !== user.id && !isUserAdmin(user)) {
    return Response.json({}, { headers, status: 403, statusText: 'forbidden' });
  }

  const result = await client.from('comments').update({ comment: json.comment }).eq('id', id);

  if (result.error) {
    console.error(result.error);
    return Response.json({}, { headers, status: 500, statusText: 'Error updating comment' });
  }

  updateUserActivity(client, user.auth_id);

  return new Response(null, { headers, status: 204 });
}

async function deleteComment({ client, headers }: Supabase, id: string, user: DBProfile) {
  const { data, error } = await client.from('comments').select().eq('id', id).single();

  if (error || !data) {
    return Response.json({}, { headers, status: 404, statusText: 'comment not found' });
  }

  const comment = data as DBComment;

  if (comment.created_by !== user.id && !isUserAdmin(user)) {
    return Response.json({}, { headers, status: 403, statusText: 'forbidden' });
  }

  const result = await client.from('comments').update({ deleted: true }).eq('id', id);

  if (result.error) {
    console.error(result.error);
    return Response.json({}, { headers, status: 500, statusText: 'Error deleting comment' });
  }

  updateUserActivity(client, user.auth_id);

  return new Response(null, { headers, status: 204 });
}

async function getProfileByAuthId(request: Request, authId: string) {
  const { client } = createSupabaseServerClient(request);

  const { data, error } = await client.from('profiles').select().eq('auth_id', authId).limit(1);

  if (error || !data?.at(0)) {
    return null;
  }

  return data[0] as DBProfile;
}

function isUserAdmin(user: DBProfile) {
  return user.roles && user.roles.includes(UserRole.ADMIN);
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
