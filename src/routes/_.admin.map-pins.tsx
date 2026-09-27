import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import type { AdminMapPinItem } from 'src/pages/Admin/MapPins/MapPinsPage';
import { MapPinsPage } from 'src/pages/Admin/MapPins/MapPinsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Map Pins' };

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageParam = Number(url.searchParams.get('page')) || 1;
  const page = Math.max(1, pageParam);
  const pageSize = 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { client } = createSupabaseServerClient(request);

  const { data, count, error } = await client
    .from('map_pins')
    .select(
      `
      id,
      name,
      country,
      country_code,
      administrative,
      post_code,
      moderation,
      profile_id,
      profile:profiles(
        id,
        username,
        display_name,
        type:profile_types(
          id,
          name,
          display_name,
          image_url,
          small_image_url
        )
      )
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const mapPins: AdminMapPinItem[] = (data || []).map((pin: any) => ({
    id: pin.id,
    name: pin.name,
    country: pin.country,
    countryCode: pin.country_code,
    administrative: pin.administrative,
    postCode: pin.post_code,
    moderation: pin.moderation,
    profileId: pin.profile_id,
    profile: pin.profile
      ? {
          id: pin.profile.id,
          username: pin.profile.username,
          displayName: pin.profile.display_name,
          profileType: pin.profile.type
            ? {
                id: pin.profile.type.id,
                name: pin.profile.type.name,
                displayName: pin.profile.type.display_name,
                imageUrl: pin.profile.type.image_url || pin.profile.type.small_image_url,
              }
            : null,
        }
      : null,
  }));

  return { mapPins, page, totalPages, totalCount };
}

export default function Index() {
  const { mapPins, page, totalPages, totalCount } = useLoaderData<typeof loader>();

  return (
    <MapPinsPage mapPins={mapPins} page={page} totalPages={totalPages} totalCount={totalCount} />
  );
}
