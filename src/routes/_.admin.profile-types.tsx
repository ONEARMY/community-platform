import type { DBProfileType } from 'oa-shared';
import { ProfileType } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileTypesPage } from '@/pages/Admin/ProfileTypes/ProfileTypesPage';

export const handle = { breadcrumb: 'Profile Types' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const profileData = await client.from('profiles').select('profile_type');

  const { data } = await client
    .from('profile_types')
    .select(
      'id,name,display_name,order,image_url,small_image_url,description,map_pin_name,is_space',
    )
    .order('order');

  const profileTypes = (data || []).map((profile_type) =>
    ProfileType.fromDB(profile_type as DBProfileType),
  );

  const profiles = new Set();
  profileData.data?.forEach((item) => profiles.add(item.profile_type));

  return { profileTypes, profiles };
}

export default function Index() {
  const { profileTypes, profiles } = useLoaderData<typeof loader>();

  return <ProfileTypesPage profileTypes={profileTypes} profiles={profiles as Set<number>} />;
}
