import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBProfile, DBResearchItem, IMediaFile, ResearchUpdateDTO } from 'oa-shared';
import { ResearchUpdate, UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { BroadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { SubscribersServiceServer } from 'src/services/subscribersService.server';
import {
  forbiddenError,
  methodNotAllowedError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';

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
      throw unauthorizedError();
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
      throw validationError('User not found', 'profile');
    }

    if (!profile.username) {
      throw forbiddenError('You must set a username before creating content');
    }

    validateRequest(request, data, research, profile);

    const updateResult = await client
      .from('research_updates')
      .insert({
        title: data.title,
        description: data.description,
        video_url: data.videoUrl,
        images: data.images,
        files: data.files,
        is_draft: data.isDraft,
        published_at: data.isDraft ? null : new Date(),
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

    await new SubscribersServiceServer(client).addResearchUpdateSubscribers(
      researchUpdate,
      profile.id,
    );

    new BroadcastCoordinationServiceServer(client).researchUpdate(researchUpdate, profile, request);
    profileService.updateUserActivity(claims.data.claims.sub);

    return Response.json({ researchUpdate }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

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
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('title is required', 'title');
  }

  if (!data.description) {
    throw validationError('description is required', 'description');
  }

  if (!data.isDraft && !data.images && !data.videoUrl) {
    throw validationError('images or video URL are required', 'images');
  }

  if (!research) {
    throw validationError('Research not found', 'research');
  }

  if (!profile) {
    throw validationError('User not found', 'profile');
  }

  if (
    profile.id !== research.author?.id &&
    !(profile.username && research.collaborators?.includes(profile.username)) &&
    !profile.roles?.includes(UserRole.ADMIN)
  ) {
    throw forbiddenError('You do not have permission to add updates to this research');
  }
}
