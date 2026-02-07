import { UserRole } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { UserAction } from 'src/common/UserAction';
import { NewsForm } from 'src/pages/News/Content/Common/NewsForm';
import { listing } from 'src/pages/News/labels';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { Box } from 'theme-ui';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn('/news/create', headers);
  }

  const { data } = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', claims.data.claims.sub)
    .limit(1);

  if (!data!.at(0)!.roles?.includes(UserRole.ADMIN)) {
    return redirect('/forbidden?page=news-create', { headers });
  }

  return null;
}

export default function Index() {
  return (
    <UserAction
      incompleteProfile={
        <Box
          data-cy="incomplete-profile-message"
          sx={{
            alignSelf: 'center',
            paddingTop: 5,
          }}
        >
          {listing.incompleteProfile}
        </Box>
      }
      loggedIn={<NewsForm data-testid="news-create-form" parentType="create" news={null} />}
      loggedOut={<></>}
    />
  );
}
