import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { SupabaseNotificationsViaEmail } from 'src/pages/UserSettings/SupabaseNotificationsViaEmail';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { Alert, Card, Flex } from 'theme-ui';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);

  const claims = await client.auth.getClaims();

  if (claims.data?.claims) {
    return redirect('/settings/notifications', { headers });
  }

  const code = url.searchParams.get('code');

  if (!code) {
    const error = `Oh no! Doesn't look you gave us the info needed to workout who you are.`;
    return data({ code, error }, { headers });
  }

  return data({ code, error: null }, { headers });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Main style={{ flex: 1 }}>
      <Flex sx={{ justifyContent: 'center', width: '100%', padding: [2, 4, 6] }}>
        {data.error && (
          <Alert variant="failure">
            {data.error}
            <br />
            Click a link in a notification email again, otherwise please report the problem.
          </Alert>
        )}
        {data.code && (
          <Card sx={{ borderRadius: 3, padding: 4, maxWidth: '650px' }}>
            <SupabaseNotificationsViaEmail userCode={data.code} />
          </Card>
        )}
      </Flex>
    </Main>
  );
}
