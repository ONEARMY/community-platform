import { ProfileFactory } from 'src/factories/profileFactory.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

import type { ProfileListItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const { contentType, contentId } = params;
  const profileFactory = new ProfileFactory(client);

  if (!contentType || !contentId) {
    return Response.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const { data, error } = await client
    .from('useful_votes')
    .select(
      `profiles(id, username, display_name, photo, country, type:profile_types(
            id,
            name,
            display_name,
            image_url,
            small_image_url,
            map_pin_name,
            description,
            is_space
          ), badges:profile_badges_relations(
        profile_badges(
          id,
          name,
          display_name,
          image_url,
          action_url
    )))`,
    )
    .eq('content_type', contentType)
    .eq('content_id', Number(contentId))
    .eq('tenant_id', process.env.TENANT_ID!);

  if (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Transform the data using ProfileFactory and pick required properties
  const users: ProfileListItem[] = data.map((row) => {
    const profile = profileFactory.fromDB(row.profiles);
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      photo: profile.photo,
      country: profile.country,
      badges: profile.badges,
      type: profile.type,
    };
  });

  return Response.json(users, { headers });
}
