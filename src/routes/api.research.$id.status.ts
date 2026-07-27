import type { ResearchStatus } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const id = Number(params.id);

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const formData = await request.formData();

    const data = {
      status: formData.get('status') as ResearchStatus,
    };

    const { valid, status, statusText } = await validateRequest(request, data);

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

    const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);

    if (!profile) {
      return Response.json({}, { headers, status: 401 });
    }

    const canEdit = await new ResearchServiceServer(client).isAllowedToEditResearchById(
      id,
      profile,
    );

    if (!canEdit) {
      return Response.json(null, { headers, status: 403 });
    }

    const result = await client.from('research').update({ status: data.status }).eq('id', id);

    if (result.error) {
      throw result.error;
    }

    new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);

    return Response.json(null, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error creating research' });
  }
};

async function validateRequest(request: Request, data: { status: ResearchStatus }) {
  if (request.method !== 'PATCH') {
    return { status: 405, statusText: 'method not allowed' };
  }

  if (data.status !== 'complete' && data.status !== 'in-progress') {
    return { status: 400, statusText: 'invalid status' };
  }

  return { valid: true };
}
