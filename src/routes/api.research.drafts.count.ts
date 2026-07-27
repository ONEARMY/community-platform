import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ContentServiceServer } from 'src/services/contentService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const profileService = new ProfileServiceServer(client);
  const profile = await profileService.getByAuthId(claims.data.claims.sub);

  if (!profile) {
    return Response.json({}, { headers, status: 400, statusText: 'invalid user' });
  }

  const count = await new ContentServiceServer(client).getDraftCount(profile.id, 'research');

  return Response.json({ total: count }, { headers });
};
