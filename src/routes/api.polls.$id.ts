import { UserRole } from 'oa-shared';
import { data, LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { PollServiceServer } from '../services/pollService.server';

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { status: 401, headers });
  }

  const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);

  if (!profile) {
    return Response.json({}, { status: 401, headers });
  }

  const body = await request.json();

  await new PollServiceServer(client).vote(Number(params.id), body.optionIds, profile.id);

  return Response.json({}, { status: 200, headers });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { client } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  const profile = claims.data
    ? await new ProfileServiceServer(client).getByAuthId(claims?.data?.claims.sub)
    : null;

  const isAdmin = !!(
    profile?.roles?.includes(UserRole.ADMIN) || profile?.roles?.includes(UserRole.EDITOR)
  );

  const poll = await new PollServiceServer(client).getPoll(Number(params.id), profile?.id, isAdmin);

  return data(poll);
};
