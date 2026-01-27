import type { DBResearchItem } from 'oa-shared';
import { ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { redirect, useLoaderData } from 'react-router';
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { authServiceServer } from 'src/services/authService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { researchServiceServer } from 'src/services/researchService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/research/${params.slug}/edit`, headers);
  }

  const result = await researchServiceServer.getBySlug(client, params.slug as string);

  if (result.error || !result.item) {
    return Response.json({ research: null }, { headers });
  }

  const authId = claims.data.claims.sub;
  const profile = await authServiceServer.getProfileByAuthId(authId, client);
  const currentUsername = profile?.username;
  const researchDb = result.item as unknown as DBResearchItem;
  const images = researchServiceServer.getResearchPublicMedia(researchDb, client);

  const research = ResearchItem.fromDB(researchDb, [], images, currentUsername);

  if (!(await researchServiceServer.isAllowedToEditResearch(client, research, authId))) {
    return redirect('/forbidden?page=research-edit', { headers });
  }

  return Response.json({ research }, { headers });
}

export default function Index() {
  const data: any = useLoaderData<typeof loader>();
  const research = data.research as ResearchItem;

  return <ResearchForm research={research} />;
}
