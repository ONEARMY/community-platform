import { ResearchItem } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, useLoaderData } from 'react-router';
import { CommentFactory } from 'src/factories/commentFactory.server';
import { NotFoundPage } from 'src/pages/NotFound/NotFound';
import { ResearchArticlePage } from 'src/pages/Research/Content/ResearchArticlePage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ContentServiceServer } from 'src/services/contentService.server';
import { ImageServiceServer } from 'src/services/imageService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const researchClient = new ResearchServiceServer(client);
  const result = await researchClient.getBySlug(params.slug as string);
  const tenantSettings = await new TenantSettingsService(client).get();

  if (result.error || !result.item) {
    return data({ research: null, tenantSettings }, { headers });
  }

  const claims = await client.auth.getClaims();
  let currentUser: { id: number; username: string | null } | undefined;
  if (claims.data?.claims) {
    const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);
    if (profile) {
      currentUser = { id: profile.id, username: profile.username };
    }
  }

  const dbResearch = result.item;

  const contentService = new ContentServiceServer(client);

  if (dbResearch.id) {
    await contentService.incrementViewCount('research', dbResearch.total_views, dbResearch.id);
  }

  const [usefulVotes, subscribers, tags] = await contentService.getMetaFields(
    dbResearch.id,
    'research',
    dbResearch.tags,
  );

  const images = researchClient.getResearchPublicMedia(dbResearch);

  const research = ResearchItem.fromDB(dbResearch, tags, images, result.collaborators, currentUser);
  research.usefulCount = usefulVotes.count || 0;
  research.subscriberCount = subscribers.count || 0;

  if (dbResearch.author) {
    const factory = new CommentFactory(new ImageServiceServer(client));
    research.author = await factory.createAuthor(dbResearch.author);
  }

  for (const dbUpdate of dbResearch.updates) {
    if (dbUpdate.update_author?.photo) {
      const imageService = new ImageServiceServer(client);
      const update = research.updates.find(({ id }) => dbUpdate.id === id);
      if (update?.author) {
        update.author.photo = imageService.getPublicUrl(dbUpdate.update_author.photo) || null;
      }
    }
  }

  return data({ research, tenantSettings }, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const research = loaderData?.research as ResearchItem;

  if (!research) {
    return [];
  }

  const title = `${research.title} - Research - ${loaderData?.tenantSettings.siteName}`;

  return generateTags(title, research.description, research.image?.publicUrl, { type: 'article' });
});

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if (!data.research) {
    return <NotFoundPage />;
  }

  return <ResearchArticlePage research={data.research} />;
}
