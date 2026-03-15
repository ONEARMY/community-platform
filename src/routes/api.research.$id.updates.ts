import type { DBMedia, DBProfile, DBResearchItem, IMediaFile, ResearchUpdateDTO } from 'oa-shared';
import { ResearchUpdate, UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { broadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { subscribersServiceServer } from 'src/services/subscribersService.server';
import { updateUserActivity } from 'src/utils/activity.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const researchId = Number(params.id);
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
      isDraft: formData.get('isDraft') === 'true',
    } satisfies ResearchUpdateDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const researchResult = await client
      .from('research')
      .select('id,title,slug,collaborators,author:profiles(id, username)')
      .eq('id', researchId)
      .single();
    const research = researchResult.data as unknown as DBResearchItem;
    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      return Response.json({}, { headers, status: 400, statusText: 'User not found' });
    }

    const { valid, status, statusText } = validateRequest(request, data, research, profile);

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

    const updateResult = await client
      .from('research_updates')
      .insert({
        title: data.title,
        description: data.description,
        video_url: data.videoUrl,
        images: data.images,
        files: data.files,
        is_draft: data.isDraft,
        research_id: researchId,
        created_by: profile.id,
        tenant_id: process.env.TENANT_ID,
      })
      .select('*,research:research(id,title,collaborators,created_by,is_draft,slug)')
      .single();

    if (updateResult.error || !updateResult.data) {
      throw updateResult.error;
    }

    const dbResearchUpdate = updateResult.data;
    const researchUpdate = ResearchUpdate.fromDB(dbResearchUpdate, []);
    researchUpdate.research = updateResult.data.research;

    await subscribersServiceServer.addResearchUpdateSubscribers(
      researchUpdate,
      profile.id,
      client,
      headers,
    );

    broadcastCoordinationServiceServer.researchUpdate(
      researchUpdate,
      profile,
      client,
      headers,
      request,
    );

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ researchUpdate }, { headers, status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error creating research' });
  }
};

function validateRequest(
  request: Request,
  data: ResearchUpdateDTO,
  research: DBResearchItem | null,
  profile: DBProfile | null,
) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' };
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' };
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' };
  }

  if (!data.images) {
    return { status: 400, statusText: 'description is required' };
  }

  if (!research) {
    return { status: 400, statusText: 'Research not found' };
  }

  if (!profile) {
    return { status: 400, statusText: 'User not found' };
  }

  if (
    profile.id !== research.author?.id &&
    !research.collaborators?.includes(profile.username) &&
    !profile.roles?.includes(UserRole.ADMIN)
  ) {
    return { status: 403, statusText: 'Forbidden' };
  }

  return { valid: true };
}
