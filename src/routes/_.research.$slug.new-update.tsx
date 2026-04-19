import { DBResearchItem, ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/research/${params.slug}/new-update`, headers);
  }

  const researchService = new ResearchServiceServer(client);

  const result = await researchService.getBySlug(params.slug as string);

  if (result.error || !result.item) {
    return redirect('/research', { headers });
  }

  const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);
  const researchDb = result.item as unknown as DBResearchItem;
  const research = ResearchItem.fromDB(researchDb, [], [], result.collaborators);

  if (!profile || !(await researchService.isAllowedToEditResearch(researchDb, profile))) {
    return redirect('/forbidden?page=research-edit-create', { headers });
  }

  return data({ research }, { headers });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return <ResearchUpdateForm id={null} formData={null} research={data.research} />;
}
