import type { DBResearchItem } from 'oa-shared';
import { ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { storageServiceServer } from 'src/services/storageService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }
  const profileService = new ProfileServiceServer(client);
  const profile = await profileService.getByAuthId(claims.data.claims.sub);

  if (!profile) {
    return Response.json({ items: [], total: 0 }, { headers });
  }

  const result = await client
    .from('research')
    .select(
      `       
        id,
       created_at,
       created_by,
       modified_at,
       title,
       description,
       slug,
       image,
       category:category(id,name),
       tags,
       total_views,
       status,
       is_draft,
       collaborators,
       author:profiles(id, display_name, username, country, badges:profile_badges_relations(
        profile_badges(
          id,
          name,
          display_name,
          image_url,
          action_url
        )
      )),
       updates:research_updates(
        id, 
        created_at, 
        title, 
        description, 
        images, 
        files, 
        file_link, 
        file_download_count, 
        video_url, 
        is_draft, 
        comment_count, 
        modified_at, 
        deleted,
        is_draft,
        update_author:profiles(id, display_name, username, photo, country, badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url
          )
        ))
      )
      `,
    )
    .or('deleted.eq.false,deleted.is.null')
    .eq('is_draft', true)
    .or(`created_by.eq.${profile.id},collaborators.cs.{${profile.username}}`);

  if (result.error) {
    console.error(result.error);
    return Response.json({}, { headers, status: 500 });
  }

  if (!result.data || result.data.length === 0) {
    return Response.json({ items: [] }, { headers });
  }

  const drafts = result.data as unknown as DBResearchItem[];
  const items = drafts.map((x) => {
    const images = x.image
      ? storageServiceServer.getPublicUrls(client, [x.image], IMAGE_SIZES.LIST)
      : [];

    return ResearchItem.fromDB(x, [], images);
  });

  return Response.json({ items }, { headers });
}
