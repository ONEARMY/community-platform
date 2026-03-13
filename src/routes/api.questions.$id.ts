import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBMedia, DBQuestion, QuestionDTO } from 'oa-shared';
import { Question } from 'oa-shared';
import type { LoaderFunctionArgs, Params } from 'react-router';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { questionServiceServer } from 'src/services/questionService.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { hasAdminRights } from 'src/utils/helpers';
import { convertToSlug } from 'src/utils/slug';
import { contentServiceServer } from '../services/contentService.server';

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const id = Number(params.id);

    const formData = await request.formData();

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.has('category') ? Number(formData.get('category')) : null,
      isDraft: formData.get('isDraft') === 'true',
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      images: formData.has('images')
        ? formData.getAll('images').map((x) => JSON.parse(x as string) as DBMedia)
        : null,
    } satisfies QuestionDTO;

    const slug = convertToSlug(data.title);

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const currentQuestion = await questionServiceServer.getById(id, client);

    const { valid, status, statusText } = await validateRequest(
      params,
      request,
      claims.data.claims.sub,
      data,
      currentQuestion,
      client,
    );

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

    const previousSlugs = contentServiceServer.updatePreviousSlugs(currentQuestion, slug);

    const questionResult = await client
      .from('questions')
      .update({
        category: data.category,
        description: data.description,
        is_draft: data.isDraft,
        images: data.images,
        title: data.title,
        slug,
        previous_slugs: previousSlugs,
        tags: data.tags,
        modified_at: new Date(),
      })
      .eq('id', params.id)
      .select();

    if (questionResult.error || !questionResult.data) {
      throw questionResult.error;
    }

    const newImages = new StorageServiceServer(client).getPublicUrls(
      questionResult.data[0].images,
      IMAGE_SIZES.GALLERY,
    );

    const question = Question.fromDB(questionResult.data[0], [], newImages);
    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ question }, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error creating question' });
  }
};

async function validateRequest(
  params: Params<string>,
  request: Request,
  userAuthId: string,
  data: any,
  currentQuestion: DBQuestion,
  client: SupabaseClient,
) {
  if (request.method !== 'PUT') {
    return { status: 405, statusText: 'method not allowed' };
  }

  if (!params.id) {
    return { status: 400, statusText: 'id is required' };
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' };
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' };
  }

  if (!currentQuestion) {
    return { status: 400, statusText: 'Question not found' };
  }

  if (
    currentQuestion.slug !== data.slug &&
    (await contentServiceServer.isDuplicateExistingSlug(
      data.slug,
      currentQuestion.id,
      client,
      'questions',
    ))
  ) {
    return {
      status: 409,
      statusText: 'This question already exists',
    };
  }

  const profileService = new ProfileServiceServer(client);
  const profile = await profileService.getByAuthId(userAuthId);

  if (!profile) {
    return { status: 400, statusText: 'User not found' };
  }

  const isCreator = currentQuestion.created_by === profile.id;

  if (!isCreator && !hasAdminRights(profile)) {
    return { status: 403, statusText: 'Unauthorized' };
  }

  return { valid: true };
}
