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
      isDraft: formData.get('draft') === 'true',
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

    await validateRequest(request, profile, data, currentProject, client);

    // Remove old cover image if it exists and no new image is provided or a different image is provided
    if (
      currentProject.cover_image?.path &&
      (!data.coverImage || data.coverImage.id !== currentProject.cover_image.id)
    ) {
      await new StorageServiceServer(client).removeImages([currentProject.cover_image.path]);
    }

    // 2. Update project
    const projectDb = await updateProject(client, profile!, currentProject, data);
    const project = Project.fromDB(projectDb, []);
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
      const step = ProjectStep.fromDB(stepDb);
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
    console.error(error);

    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    return Response.json({ error: 'Error updating project', status: 500 }, { status: 500 });
  }
};

async function validateRequest(
  request: Request,
  profile: DBProfile | null,
  data: any,
  currentProject: DBProject,
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
    currentProject.slug !== data.slug &&
    (await contentServiceServer.isDuplicateExistingSlug(
      data.slug,
      currentProject.id,
      client,
      'projects',
    ))
  ) {
    throw conflictError('This project already exists');
  }
}

async function updateProject(
  client: SupabaseClient,
  profile: DBProfile,
  currentProject: DBProject,
  data: ProjectDTO,
) {
  const slug = convertToSlug(data.title);
  const previousSlugs = contentServiceServer.updatePreviousSlugs(currentProject, slug);

  let moderation = currentProject.moderation;

  if (currentProject.is_draft && !data.isDraft) {
    moderation = profile?.roles?.includes(UserRole.ADMIN) ? 'accepted' : 'awaiting-moderation';
  }

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
