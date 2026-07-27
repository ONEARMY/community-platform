import { DBProject } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { LibraryForm } from 'src/pages/Library/Content/Common/LibraryForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { LibraryServiceServer } from 'src/services/libraryService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { StorageServiceServer } from 'src/services/storageService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/library/${params.slug}/edit`, headers);
  }

  const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);
  const libraryService = new LibraryServiceServer(client);

  const projectDb = (await libraryService.getBySlug(params.slug as string))
    .data as unknown as DBProject;

  if (!profile || !(await libraryService.isAllowedToEditProject(projectDb, profile))) {
    return redirect('/forbidden?page=library-edit', { headers });
  }

  const allImages = projectDb.steps?.flatMap((x) => x.images).filter((x) => !!x) || [];
  if (projectDb.cover_image) {
    allImages.push(projectDb.cover_image);
  }
  const publicImages = allImages.length
    ? new StorageServiceServer(client).getPublicUrls(allImages)
    : [];

  const formData = DBProject.toFormData(projectDb, publicImages);

  return data({ formData, id: projectDb.id }, { headers });
}

export default function Index() {
  const { id, formData } = useLoaderData<typeof loader>();

  return <LibraryForm id={id} formData={formData} />;
}
