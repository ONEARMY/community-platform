import { ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdateForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { researchServiceServer } from 'src/services/researchService.server';
import { storageServiceServer } from 'src/services/storageService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(
      `/research/${params.slug}/edit-update/${params.updateId}`,
      headers,
    );
  }

  const result = await researchServiceServer.getBySlug(client, params.slug as string);

  if (result.error || !result.item) {
    return redirect('/research', { headers });
  }

  const username = claims.data.claims.user_metadata?.username;
  const researchDb = result.item;
  const images = researchServiceServer.getResearchPublicMedia(researchDb, client);
  const research = ResearchItem.fromDB(researchDb, [], images, result.collaborators, username);
  const update = research.updates.find((x) => x.id === Number(params.updateId));

  if (!update) {
    return redirect('/research', { headers });
  }

  if (!(await researchServiceServer.isAllowedToEditResearch(client, research, username))) {
    return redirect('/forbidden?page=research-update-edit', { headers });
  }

  const updateDb = researchDb.updates.find((x) => x.id === Number(params.updateId));
  const fileLink = updateDb?.file_link || undefined;
  const files = updateDb?.files?.at(0)
    ? await storageServiceServer.getPathDocuments(
        `research/${research.id}/updates/${update.id}`,
        `/api/documents/research_update/${update.id}`,
        client,
      )
    : [];

  return data({ research, update, fileLink, files }, { headers });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <ResearchUpdateForm
      research={data.research}
      researchUpdate={data.update}
      fileLink={data.fileLink}
      files={data.files}
    />
  );
}
