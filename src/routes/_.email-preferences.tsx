import type { LoaderFunctionArgs } from 'react-router';
import { redirect, useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { SupabaseNotificationsViaEmail } from 'src/pages/UserSettings/SupabaseNotificationsViaEmail';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { Alert, Card, Flex } from 'theme-ui';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);

  const { data } = await client.auth.getClaims();

  if (data?.claims) {
    return redirect('/settings/notifications', { headers });
  }

  const code = url.searchParams.get('code');

  if (!code) {
    const error = `Oh no! Doesn't look you gave us the info needed to workout who you are.`;
    return Response.json({ error }, { headers });
  }

  return Response.json({ code }, { headers });
};

export default function Index() {
  const data: any = useLoaderData<typeof loader>();
  const code = data.code;
  const error = data.error as string;

  return (
    <Main style={{ flex: 1 }}>
      <Flex sx={{ justifyContent: 'center', width: '100%', padding: [2, 4, 6] }}>
        {error && (
          <Alert variant="failure">
            {error}
            <br />
            Click a link in a notification email again, otherwise please report the problem.
          </Alert>
        )}
        {code && (
          <Card sx={{ borderRadius: 3, padding: 4, maxWidth: '650px' }}>
            <SupabaseNotificationsViaEmail userCode={code} />
          </Card>
        )}
      </Flex>
    </Main>
  );
}
