import type { LoaderFunctionArgs } from 'react-router';
import { UserAction } from 'src/common/UserAction';
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm';
import { listing } from 'src/pages/Question/labels';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { Box } from 'theme-ui';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn('/questions/create', headers);
  }

  return null;
}

export default function Index() {
  return (
    <UserAction
      incompleteProfile={
        <Box data-cy="incomplete-profile-message" sx={{ alignSelf: 'center', paddingTop: 5 }}>
          {listing.incompleteProfile}
        </Box>
      }
      loggedIn={
        <QuestionForm data-testid="question-create-form" parentType="create" question={null} />
      }
      loggedOut={<></>}
    />
  );
}
