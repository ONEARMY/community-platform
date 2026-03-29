import { DBResearchUpdate, ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdateForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { StorageServiceServer } from 'src/services/storageService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
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

  const username = claims.data.claims.user_metadata?.username;
  const researchDb = result.item;
  const research = ResearchItem.fromDB(researchDb, [], [], result.collaborators, username);
  const update = research.updates.find((x) => x.id === Number(params.updateId));

  if (!update) {
    return redirect('/research', { headers });
  }

  if (!(await researchService.isAllowedToEditResearch(researchDb, username))) {
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
