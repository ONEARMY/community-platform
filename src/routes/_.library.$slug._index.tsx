import { useLoaderData } from 'react-router';
import { Project } from 'oa-shared';
import { ProjectPage } from 'src/pages/Library/Content/Page/ProjectPage';
import { NotFoundPage } from 'src/pages/NotFound/NotFound';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { contentServiceServer } from 'src/services/contentService.server';
import { libraryServiceServer } from 'src/services/libraryService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

import type { DBProject } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const result = await libraryServiceServer.getBySlug(client, params.slug as string);

  if (result.error || !result.data) {
    return Response.json({ project: null }, { headers });
  }

  const dbProject = result.data as unknown as DBProject;

  if (dbProject.id) {
    await contentServiceServer.incrementViewCount(
      client,
      'projects',
      dbProject.total_views,
      dbProject.id,
    );
  }

  const [usefulVotes, subscribers, tags] = await contentServiceServer.getMetaFields(
    client,
    dbProject.id,
    'projects',
    dbProject.tags,
  );

  const images = libraryServiceServer.getProjectPublicMedia(dbProject, client);

  const project = Project.fromDB(dbProject, tags, images);
  project.usefulCount = usefulVotes.count || 0;
  project.subscriberCount = subscribers.count || 0;

  return Response.json({ project }, { headers });
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>;
}

export const meta = mergeMeta(({ loaderData }) => {
  const project = (loaderData as any)?.project as Project;

  if (!project) {
    return [];
  }

  const title = `${project.title} - Library - ${import.meta.env.VITE_SITE_NAME}`;

  return generateTags(title, project.description, project.coverImage?.publicUrl);
});

export default function Index() {
  const data = useLoaderData();
  const project = data.project as Project;

  if (!project) {
    return <NotFoundPage />;
  }

  return <ProjectPage item={project} />;
}
