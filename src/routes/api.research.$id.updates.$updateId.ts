import type { DBMedia, DBResearchUpdate, IMediaFile, ResearchUpdateDTO } from 'oa-shared';
import { ResearchUpdate } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { broadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { updateUserActivity } from 'src/utils/activity.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const researchId = Number(params.id);
    const updateId = Number(params.updateId);

    if (request.method === 'DELETE') {
      return await deleteResearchUpdate(request, researchId, updateId);
    }

    const formData = await request.formData();

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      videoUrl: formData.get('videoUrl') as string,
      images: formData.has('images')
        ? formData.getAll('images').map((x) => JSON.parse(x as string) as DBMedia)
        : null,
      files: formData.has('files')
        ? formData.getAll('files').map((x) => JSON.parse(x as string) as IMediaFile)
        : null,
      fileLink: formData.get('fileLink') as string,
      isDraft: formData.get('draft') === 'true',
    } satisfies ResearchUpdateDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const { valid, status, statusText } = await validateRequest(request, data);

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!new ResearchServiceServer(client).isAllowedToEditUpdate(profile, researchId, updateId)) {
      return Response.json({}, { status: 403, headers });
    }

    const researchUpdateResult = await client
      .from('research_updates')
      .select()
      .eq('id', updateId)
      .single();

    const oldResearchUpdate = researchUpdateResult.data as DBResearchUpdate;

    const researchUpdateAfterUpdating = await client
      .from('research_updates')
      .update({
        title: data.title,
        description: data.description,
        is_draft: data.isDraft,
        images: data.images,
        modified_at: new Date(),
        video_url: data.videoUrl,
        files: data.files,
      })
      .eq('id', oldResearchUpdate.id)
      .select('*,research:research(id,title,slug,is_draft)')
      .single();

    if (researchUpdateAfterUpdating.error || !researchUpdateAfterUpdating.data) {
      throw researchUpdateAfterUpdating.error;
    }

    const researchUpdate = ResearchUpdate.fromDB(researchUpdateAfterUpdating.data, []);
    researchUpdate.research = researchUpdateAfterUpdating.data.research;

    broadcastCoordinationServiceServer.researchUpdate(
      researchUpdate,
      profile,
      client,
      headers,
      request,
      oldResearchUpdate,
    );

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ researchUpdate }, { headers, status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error creating research' });
  }
};

async function deleteResearchUpdate(request: Request, id: number, updateId: number) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const profileService = new ProfileServiceServer(client);
  const profile = await profileService.getByAuthId(claims.data.claims.sub);

  if (!new ResearchServiceServer(client).isAllowedToEditUpdate(profile, id, updateId)) {
    return Response.json({}, { status: 403, headers });
  }

  await client
    .from('research_updates')
    .update({
      modified_at: new Date(),
      deleted: true,
    })
    .eq('id', updateId);

  return Response.json({}, { status: 200, headers });
}

async function validateRequest(request: Request, data: ResearchUpdateDTO) {
  if (request.method !== 'PUT') {
    return { status: 405, statusText: 'method not allowed' };
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' };
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' };
  }

  return { valid: true };
}
