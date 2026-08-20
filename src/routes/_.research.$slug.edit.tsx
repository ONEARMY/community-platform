import { DBResearchItem, ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs, MiddlewareFunction } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { sessionContext } from 'src/context';
import { sessionMiddleware } from 'src/middleware/session.server';
import { ForbiddenPage } from 'src/pages/Forbidden/labels';
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { StorageServiceServer } from 'src/services/storageService.server';

export const middleware: MiddlewareFunction<Response>[] = [sessionMiddleware];

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const session = context.get(sessionContext);

  if (!session) {
    return redirectServiceServer.redirectSignIn(`/research/${params.slug}/edit`, headers);
  }

  const researchService = new ResearchServiceServer(client);
  const result = await researchService.getBySlug(params.slug as string);

  if (result.error || !result.item) {
    return redirect('/research', { headers });
  }

  const researchDb = result.item as unknown as DBResearchItem;

  const image = researchDb?.image
    ? new StorageServiceServer(client).getPublicUrl(researchDb?.image)
    : null;

  const formData = DBResearchItem.toFormData(researchDb, image);
  const currentUser = session.profileId
    ? { id: session.profileId, username: session.username }
    : undefined;
  const research = ResearchItem.fromDB(researchDb, [], [], result.collaborators, currentUser);

  const canEdit =
    session.profileId &&
    (await researchService.isAllowedToEditResearch(researchDb, {
      id: session.profileId,
      username: session.username,
      roles: session.roles,
    }));

  if (!canEdit) {
    return redirect(`/forbidden?page=${ForbiddenPage.RESEARCH_EDIT}`, { headers });
  }

  return data({ formData, id: researchDb.id, research }, { headers });
}

export default function Index() {
  const { id, formData, research } = useLoaderData<typeof loader>();

  return <ResearchForm id={id} formData={formData} research={research} />;
}
