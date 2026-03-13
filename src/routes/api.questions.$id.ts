import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
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
import {
  conflictError,
  forbiddenError,
  methodNotAllowedError,
  validationError,
} from 'src/utils/httpException';
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

    await validateRequest(params, request, claims.data.claims.sub, data, currentQuestion, client);

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
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error updating question' }, { headers, status: 500 });
  }
};

async function validateRequest(
  params: Params<string>,
  request: Request,
  userAuthId: string,
  data: QuestionDTO,
  currentQuestion: DBQuestion,
  client: SupabaseClient,
) {
  if (request.method !== 'PUT') {
    throw methodNotAllowedError();
  }

  if (!params.id) {
    throw validationError('ID is required', 'id');
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.description) {
    throw validationError('Description is required', 'description');
  }

  if (!currentQuestion) {
    throw validationError('Question not found');
  }

  const slug = convertToSlug(data.title);

  if (
    currentQuestion.slug !== slug &&
    (await contentServiceServer.isDuplicateExistingSlug(
      slug,
      currentQuestion.id,
      client,
      'questions',
    ))
  ) {
    throw conflictError('This question already exists');
  }

  const profileService = new ProfileServiceServer(client);
  const profile = await profileService.getByAuthId(userAuthId);

  if (!profile) {
    throw validationError('User not found');
  }

  const isCreator = currentQuestion.created_by === profile.id;

  if (!isCreator && !hasAdminRights(profile)) {
    throw forbiddenError('Forbidden');
  }
}
