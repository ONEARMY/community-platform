import { DBResearchItem, ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs, MiddlewareFunction } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { sessionContext } from 'src/context';
import { sessionMiddleware } from 'src/middleware/session.server';
import { ForbiddenPage } from 'src/pages/Forbidden/labels';
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';

export const middleware: MiddlewareFunction<Response>[] = [sessionMiddleware];

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const session = context.get(sessionContext);

  if (!session) {
    return redirectServiceServer.redirectSignIn(`/research/${params.slug}/new-update`, headers);
  }

  const researchService = new ResearchServiceServer(client);

  const result = await researchService.getBySlug(params.slug as string);

  if (result.error || !result.item) {
    return redirect('/research', { headers });
  }

  const researchDb = result.item as unknown as DBResearchItem;
  const research = ResearchItem.fromDB(researchDb, [], [], result.collaborators);

  const canEdit =
    session.profileId &&
    (await researchService.isAllowedToEditResearch(researchDb, {
      id: session.profileId,
      username: session.username,
      roles: session.roles,
    }));

  if (!canEdit) {
    return redirect(`/forbidden?page=${ForbiddenPage.RESEARCH_EDIT_CREATE}`, { headers });
  }

  return data({ research }, { headers });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return <ResearchUpdateForm id={null} formData={null} research={data.research} />;
}
