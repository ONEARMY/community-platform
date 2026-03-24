import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type {
  DBMedia,
  DBProfile,
  DBProject,
  DifficultyLevel,
  IMediaFile,
  ProjectDTO,
} from 'oa-shared';
import { Project, ProjectStep, UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { contentServiceServer } from 'src/services/contentService.server';
import { LibraryServiceServer } from 'src/services/libraryService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { conflictError, methodNotAllowedError, validationError } from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const id = Number(params.id);

    if (request.method === 'DELETE') {
      return await deleteProject(request, id);
    }

    const formData = await request.formData();

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      isDraft: formData.get('isDraft') === 'true',
      time: formData.get('time') as string,
      category: formData.has('category') ? Number(formData.get('category')) : null,
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      fileLink: formData.has('fileLink') ? (formData.get('fileLink') as string) : null,
      coverImage: formData.has('coverImage')
        ? (JSON.parse(formData.get('coverImage') as string) as DBMedia)
        : null,
      files: formData.has('files')
        ? formData.getAll('files').map((x) => JSON.parse(x as string) as IMediaFile)
        : null,
      difficultyLevel: formData.has('difficultyLevel')
        ? (formData.get('difficultyLevel') as DifficultyLevel)
        : null,
      stepCount: parseInt(formData.get('stepCount') as string),
    } satisfies ProjectDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const profileService = new ProfileServiceServer(client);
    const libraryService = new LibraryServiceServer(client);

    const currentProject = await libraryService.getById(id);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    const slug = convertToSlug(data.title);
    await validateRequest(request, profile, data, currentProject, slug, client);

    // Remove old cover image if it exists and no new image is provided or a different image is provided
    if (
      currentProject.cover_image?.path &&
      (!data.coverImage || data.coverImage.id !== currentProject.cover_image.id)
    ) {
      await new StorageServiceServer(client).removeImages([currentProject.cover_image.path]);
    }

    // 2. Update project

    const projectDb = await updateProject(client, profile!, currentProject, data, slug);
    const project = Project.fromDB(projectDb, []);
    const storage = new StorageServiceServer(client);

    project.coverImage = projectDb.cover_image
      ? storage.getPublicUrls([projectDb.cover_image])?.at(0) || null
      : null;

    const existingStepIds = await libraryService.getProjectStepIds(projectDb.id);

    // 3. Upsert Steps
    const stepsToKeepIds: number[] = [];

    for (let i = 0; i < data.stepCount; i++) {
      const stepId = formData.has(`steps.[${i}].id`)
        ? Number(formData.get(`steps.[${i}].id`))
        : null;
      if (stepId) {
        stepsToKeepIds.push(+stepId);
      }

      const images = formData.has(`steps.[${i}].images`)
        ? formData.getAll(`steps.[${i}].images`).map((x) => JSON.parse(x as string) as DBMedia)
        : null;

      const stepDb = await libraryService.upsertStep(
        projectDb.id,
        stepId,
        {
          title: formData.get(`steps.[${i}].title`) as string,
          description: formData.get(`steps.[${i}].description`) as string,
          videoUrl: (formData.get(`steps.[${i}].videoUrl`) as string) || null,
          images: images,
        },
        i + 1,
      );

      const publicImages = images ? storage.getPublicUrls(images) : undefined;
      const step = ProjectStep.fromDB(stepDb, publicImages);
      project.steps.push(step);
    }

    // delete steps
    const stepsToDelete = existingStepIds.filter((id) => !stepsToKeepIds.includes(id));

    if (stepsToDelete.length > 0) {
      await libraryService.deleteStepsById([...stepsToDelete]);
    }

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ project }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error updating project', status: 500 }, { status: 500 });
  }
};

async function validateRequest(
  request: Request,
  profile: DBProfile | null,
  data: ProjectDTO,
  currentProject: DBProject,
  slug: string,
  client: SupabaseClient,
): Promise<void> {
  if (!profile) {
    throw validationError('User not found');
  }
  if (request.method !== 'PUT') {
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.description) {
    throw validationError('Description is required', 'description');
  }

  if (!data.isDraft && (!data.stepCount || data.stepCount < 3)) {
    throw validationError('3 steps are required', 'stepCount');
  }

  if (
    currentProject.slug !== slug &&
    (await contentServiceServer.isDuplicateExistingSlug(
      slug,
      currentProject.id,
      client,
      'projects',
    ))
  ) {
    throw conflictError('A project with this name already exists');
  }
}

async function updateProject(
  client: SupabaseClient,
  profile: DBProfile,
  currentProject: DBProject,
  data: ProjectDTO,
  slug: string,
) {
  const previousSlugs = contentServiceServer.updatePreviousSlugs(currentProject, slug);

  let moderation = currentProject.moderation;

  const isFirstPublish = currentProject.is_draft && !data.isDraft && !currentProject.published_at;

  if (currentProject.is_draft && !data.isDraft) {
    moderation = profile?.roles?.includes(UserRole.ADMIN) ? 'accepted' : 'awaiting-moderation';
  }

  const now = new Date();

  const projectResult = await client
    .from('projects')
    .update({
      title: data.title,
      description: data.description,
      slug,
      previous_slugs: previousSlugs,
      category: data.category,
      tags: data.tags,
      is_draft: data.isDraft,
      file_link: data.fileLink,
      difficulty_level: data.difficultyLevel,
      time: data.time,
      files: data.files,
      moderation,
      cover_image: data.coverImage || null,
      modified_at: new Date(),
      ...(isFirstPublish && { published_at: now }),
    })
    .eq('id', currentProject.id)
    .select();

  if (projectResult.error || !projectResult.data) {
    throw projectResult.error;
  }

  return projectResult.data[0] as unknown as DBProject;
}

async function deleteProject(request: Request, id: number) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const canEdit = await new LibraryServiceServer(client).isAllowedToEditProjectById(
    id,
    claims.data.claims.user_metadata?.username,
  );

  if (canEdit) {
    await client
      .from('projects')
      .update({
        modified_at: new Date(),
        deleted: true,
      })
      .eq('id', id);

    return Response.json({}, { status: 200, headers });
  }

  return Response.json({}, { status: 500, headers });
}
