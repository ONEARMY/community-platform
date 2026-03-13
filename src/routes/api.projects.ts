import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type {
  DBMedia,
  DBProfile,
  DBProject,
  DBProjectStep,
  DifficultyLevel,
  IMediaFile,
  Moderation,
  ProjectDTO,
  ProjectStepDTO,
} from 'oa-shared';
import { Project, ProjectStep, UserRole } from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import type { LibrarySortOption } from 'src/pages/Library/Content/List/LibrarySortOptions';
import { ITEMS_PER_PAGE } from 'src/pages/Library/constants';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { contentServiceServer } from 'src/services/contentService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { subscribersServiceServer } from 'src/services/subscribersService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { conflictError, methodNotAllowedError, validationError } from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const q = searchParams.get('q');
  const category = Number(searchParams.get('category')) || undefined;
  const sort = searchParams.get('sort') as LibrarySortOption;
  const skip = Number(searchParams.get('skip')) || 0;

  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  const username = claims.data?.claims?.user_metadata?.username || null;

  const { data, error } = await client.rpc('get_projects', {
    search_query: q || null,
    category_id: category,
    sort_by: sort,
    offset_val: skip,
    limit_val: ITEMS_PER_PAGE,
    current_username: username,
  });

  const countResult = await client.rpc('get_projects_count', {
    search_query: q || null,
    category_id: category,
    current_username: username,
  });
  const count = countResult.data || 0;

  if (error) {
    console.error(error);
    return Response.json({}, { status: 500, headers });
  }

  const dbItems = data as DBProject[];
  const items = dbItems.map((x) => {
    const images = x.cover_image
      ? new StorageServiceServer(client).getPublicUrls([x.cover_image], IMAGE_SIZES.LIST)
      : [];
    return Project.fromDB(x, [], images);
  });

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'projects',
      p_content_ids: items.map((x) => x.id),
    });

    if (votes.data) {
      const votesByContentId = votes.data.reduce((acc, current) => {
        acc.set(current.content_id, current.count);
        return acc;
      }, new Map());

      for (const item of items) {
        if (votesByContentId.has(item.id)) {
          item.usefulCount = votesByContentId.get(item.id)!;
        }
      }
    }
  }

  return Response.json({ items, total: count }, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      time: formData.get('time') as string,
      category: formData.has('category') ? Number(formData.get('category')) : null,
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      fileLink: formData.has('fileLink') ? (formData.get('fileLink') as string) : null,
      difficultyLevel: formData.has('difficultyLevel')
        ? (formData.get('difficultyLevel') as DifficultyLevel)
        : null,
      isDraft: formData.get('draft') === 'true',
      stepCount: parseInt(formData.get('stepCount') as string),
      coverImage: formData.has('coverImage')
        ? (JSON.parse(formData.get('coverImage') as string) as DBMedia)
        : null,
      files: formData.has('files')
        ? formData.getAll('files').map((x) => JSON.parse(x as string) as IMediaFile)
        : null,
    } satisfies ProjectDTO;

    const slug = convertToSlug((formData.get('title') as string) || '');
    let moderation = data.isDraft ? null : ('awaiting-moderation' as Moderation);
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    await validateRequest(request, data, client);

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!data.isDraft && profile?.roles?.includes(UserRole.ADMIN)) {
      moderation = 'accepted';
    }

    if (!profile) {
      return Response.json({}, { headers, status: 400, statusText: 'User not found' });
    }

    const projectDb = await createProject(client, data, slug, moderation, profile);
    const project = Project.fromDB(projectDb, []);

    project.coverImage = data.coverImage
      ? new StorageServiceServer(client).getPublicUrls([data.coverImage])?.at(0) || null
      : null;

    project.steps = await uploadSteps(data, formData, projectDb, client);
    subscribersServiceServer.add('projects', project.id, profile.id, client, headers);

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ project }, { headers, status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    return Response.json({ error: 'Error creating project', status: 500 }, { status: 500 });
  }
};

async function uploadSteps(data, formData: FormData, projectDb: DBProject, client: SupabaseClient) {
  const steps: ProjectStep[] = [];
  const storage = new StorageServiceServer(client);

  for (let i = 0; i < data.stepCount; i++) {
    const stepImages = formData.has(`steps.[${i}].images`)
      ? formData.getAll(`steps.[${i}].images`).map((x) => JSON.parse(x as string) as DBMedia)
      : null;

    const stepDb = await createStep(
      client,
      projectDb.id,
      {
        title: formData.get(`steps.[${i}].title`) as string,
        description: formData.get(`steps.[${i}].description`) as string,
        videoUrl: (formData.get(`steps.[${i}].videoUrl`) as string) || null,
        images: stepImages,
      },
      i + 1,
    );

    const publicImages = stepImages ? storage.getPublicUrls(stepImages) : undefined;
    const step = ProjectStep.fromDB(stepDb, publicImages);

    steps.push(step);
  }

  return steps;
}

async function validateRequest(request: Request, data: any, client: SupabaseClient): Promise<void> {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  } else if (data.title.length < 5) {
    throw validationError('Title is too short', 'title');
  }

  if (!data.description) {
    throw validationError('Description is required', 'description');
  }

  if (!data.isDraft && (!data.stepCount || data.stepCount < 3)) {
    throw validationError('3 steps are required', 'stepCount');
  }

  if (await contentServiceServer.isDuplicateNewSlug(data.slug, client, 'projects')) {
    throw conflictError('This project already exists');
  }

  // No need to validate cover image since it's uploaded immediately via /api/images
}

async function createProject(
  client: SupabaseClient,
  data: ProjectDTO,
  slug: string,
  moderation: Moderation | null,
  profile: DBProfile,
) {
  const projectResult = await client
    .from('projects')
    .insert({
      created_by: profile.id,
      title: data.title,
      description: data.description,
      slug: slug,
      category: data.category,
      tags: data.tags,
      is_draft: data.isDraft,
      file_link: data.fileLink,
      difficulty_level: data.difficultyLevel,
      time: data.time,
      files: data.files,
      moderation: moderation,
      tenant_id: process.env.TENANT_ID,
    })
    .select();

  if (projectResult.error || !projectResult.data) {
    throw projectResult.error;
  }

  return projectResult.data[0] as unknown as DBProject;
}

async function createStep(
  client: SupabaseClient,
  projectId: number,
  values: ProjectStepDTO,
  order: number,
) {
  const { data, error } = await client
    .from('project_steps')
    .insert({
      title: values.title,
      description: values.description,
      project_id: projectId,
      video_url: values.videoUrl,
      images: values.images,
      order: order,
      tenant_id: process.env.TENANT_ID,
    })
    .select();

  if (error || !data) {
    throw error;
  }

  return data[0] as unknown as DBProjectStep;
}
