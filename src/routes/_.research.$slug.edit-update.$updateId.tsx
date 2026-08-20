import { DBResearchUpdate, ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs, MiddlewareFunction } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { sessionContext } from 'src/context';
import { sessionMiddleware } from 'src/middleware/session.server';
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdateForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { StorageServiceServer } from 'src/services/storageService.server';

export const middleware: MiddlewareFunction<Response>[] = [sessionMiddleware];

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const session = context.get(sessionContext);

  if (!session) {
    return redirectServiceServer.redirectSignIn(
      `/research/${params.slug}/edit-update/${params.updateId}`,
      headers,
    );
  }

  const researchService = new ResearchServiceServer(client);

  const result = await researchService.getBySlug(params.slug as string);

  if (result.error || !result.item) {
    return redirect('/research', { headers });
  }

  const researchDb = result.item;
  const currentUser = session.profileId
    ? { id: session.profileId, username: session.username }
    : undefined;
  const research = ResearchItem.fromDB(researchDb, [], [], result.collaborators, currentUser);
  const update = research.updates.find((x) => x.id === Number(params.updateId));

  if (!update) {
    return redirect('/research', { headers });
  }

  const canEdit =
    session.profileId &&
    (await researchService.isAllowedToEditResearch(researchDb, {
      id: session.profileId,
      username: session.username,
      roles: session.roles,
    }));

  if (!canEdit) {
    return redirect('/forbidden?page=research-update-edit', { headers });
  }

  const updateDb = researchDb.updates.find((x) => x.id === Number(params.updateId));

  const publicImages = updateDb?.images
    ? new StorageServiceServer(client).getPublicUrls(updateDb?.images)
    : [];

  const formData = DBResearchUpdate.toFormData(updateDb!, publicImages);

  return data({ id: updateDb!.id, formData, research }, { headers });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return <ResearchUpdateForm id={data.id} formData={data.formData} research={data.research} />;
}
