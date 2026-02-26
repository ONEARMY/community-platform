import type { Profile, UserCreatedDocs } from 'oa-shared';
import { AuthorVotes } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { ProfileFactory } from 'src/factories/profileFactory.server';
import { ProfilePage } from 'src/pages/User/content/ProfilePage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { libraryServiceServer } from 'src/services/libraryService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { questionServiceServer } from 'src/services/questionService.server';
import { researchServiceServer } from 'src/services/researchService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { Text } from 'theme-ui';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  try {
    const tenantSettings = await new TenantSettingsService(client).get();
    const profileService = new ProfileServiceServer(client);

    const username = params.id as string;

    const [profileDb, projects, research, questions] = await Promise.all([
      profileService.getByUsername(username),
      libraryServiceServer.getUserProjects(client, username),
      researchServiceServer.getUserResearch(client, username),
      questionServiceServer.getQuestionsByUser(client, username),
    ]);

    const userCreatedDocs = {
      projects,
      research,
      questions,
    } as UserCreatedDocs;

    if (!profileDb) {
      return data({ profile: null, tenantSettings }, { headers });
    }

    const authorVotesDb = await profileService.getAuthorUsefulVotes(profileDb.id);
    const authorVotes = authorVotesDb ? authorVotesDb.map((x) => AuthorVotes.fromDB(x)) : undefined;

    if (profileDb?.id) {
      // not awaited to not block the render
      profileService.incrementViewCount(profileDb.id, profileDb.total_views);
    }

    const profileFactory = new ProfileFactory(client);
    const profile = profileFactory.fromDB(profileDb, authorVotes);

    return data(
      {
        profile,
        userCreatedDocs,
        tenantSettings,
      },
      { headers },
    );
  } catch (error) {
    console.error(error);
    return redirect('/', { headers });
  }
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const profile = (loaderData as any)?.profile as Profile;

  if (!profile) {
    return [];
  }

  const title = `${profile.displayName} - Profile - ${loaderData?.tenantSettings.siteName}`;

  return generateTags(title);
});

export default function Index() {
  const data = useLoaderData();
  const profile = data.profile as Profile;
  const userCreatedDocs = data.userCreatedDocs as UserCreatedDocs;

  if (!profile) {
    return (
      <Text
        sx={{
          width: '100%',
          textAlign: 'center',
          display: 'block',
          marginTop: 10,
        }}
      >
        User not found
      </Text>
    );
  }

  return <ProfilePage profile={profile} userCreatedDocs={userCreatedDocs} />;
}
