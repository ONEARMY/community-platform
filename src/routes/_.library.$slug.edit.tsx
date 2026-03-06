import type { DBProject } from 'oa-shared';
import { Project } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { LibraryForm } from 'src/pages/Library/Content/Common/Library.form';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { libraryServiceServer } from 'src/services/libraryService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { storageServiceServer } from 'src/services/storageService.server';
import { dbResult } from 'src/utils/supabase.types';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/library/${params.slug}/edit`, headers);
  }

  // const username = user.user_metadata.username
  const username = claims.data.claims.user_metadata?.username;
  const projectDb = dbResult<DBProject>(
    (await libraryServiceServer.getBySlug(client, params.slug as string)).data,
  );
  if (
    !(await libraryServiceServer.isAllowedToEditProject(
      client,
      projectDb.author?.username || '',
      username,
    ))
  ) {
    return redirect('/forbidden?page=library-edit', { headers });
  }

  const images = libraryServiceServer.getProjectPublicMedia(projectDb, client);

  const project = Project.fromDB(projectDb, [], images);

  const fileLink = projectDb?.file_link || undefined;
  const files = projectDb?.files?.at(0)
    ? await storageServiceServer.getPathDocuments(
        `projects/${projectDb.id}`,
        `/api/documents/project/${projectDb.id}`,
        client,
      )
    : [];

  return data({ project, files, fileLink }, { headers });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <ClientOnly>
      {() => (
        <LibraryForm
          project={loaderData.project}
          files={loaderData.files}
          fileLink={loaderData.fileLink}
        />
      )}
    </ClientOnly>
  );
}
