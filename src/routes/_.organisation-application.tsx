import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { OrganisationApplicationForm } from 'src/pages/SignUp/OrganisationApplicationForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirect('/sign-up/organisation', { headers });
  }

  // Already has a profile — either a member, or an organisation that already applied
  const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);

  if (profile) {
    return redirect(profile.username ? `/u/${profile.username}` : '/settings/profile', {
      headers,
    });
  }

  const hasApplication = await new OrganisationApplicationsServiceServer(client).existsByAuthId(
    claims.data.claims.sub,
  );

  if (!hasApplication) {
    return redirect('/sign-up/organisation', { headers });
  }

  const profileTypes = await new ProfileTypesServiceServer(client).get();
  const spaceTypes = profileTypes.filter((type) => type.isSpace).sort((a, b) => a.order - b.order);

  return data({ profileTypes: spaceTypes }, { headers });
};

export const meta = mergeMeta<typeof loader>(() => {
  return generateTags('Application form');
});

export default function Index() {
  const { profileTypes } = useLoaderData<typeof loader>();

  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>
        {() => <OrganisationApplicationForm profileTypes={profileTypes} />}
      </ClientOnly>
    </Main>
  );
}
