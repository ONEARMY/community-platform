import { DBResearchItem, ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { StorageServiceServer } from 'src/services/storageService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/research/${params.slug}/edit`, headers);
  }

  const researchService = new ResearchServiceServer(client);
  const result = await researchService.getBySlug(params.slug as string);

  if (result.error || !result.item) {
    return redirect('/research', { headers });
  }

  const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);
  const researchDb = result.item as unknown as DBResearchItem;

  const image = researchDb?.image
    ? new StorageServiceServer(client).getPublicUrl(researchDb?.image)
    : null;

  const formData = DBResearchItem.toFormData(researchDb, image);
  const currentUser = profile ? { id: profile.id, username: profile.username } : undefined;
  const research = ResearchItem.fromDB(researchDb, [], [], result.collaborators, currentUser);

  if (!profile || !(await researchService.isAllowedToEditResearch(researchDb, profile))) {
    return redirect('/forbidden?page=research-edit', { headers });
  }

  return data({ formData, id: researchDb.id, research }, { headers });
}

export default function Index() {
  const { id, formData, research } = useLoaderData<typeof loader>();

  return <ResearchForm id={id} formData={formData} research={research} />;
}
