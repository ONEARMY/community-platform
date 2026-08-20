import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main';
import { getForbiddenMessage } from 'src/pages/Forbidden/labels';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const settings = await new TenantSettingsService(client).get();

  const url = new URL(request.url);
  const pageMatch = url.search.match(/[?&]page=([^&]*)/);
  const page = pageMatch ? decodeURIComponent(pageMatch[1]) : null;

  return { page, settings, url };
}

export default function Index() {
  const { page, settings, url } = useLoaderData<typeof loader>() || {};

  const { heading, body, actionLabel } = getForbiddenMessage(page);

  return (
    <Main style={{ flex: 1 }}>
      <div className="mx-auto mt-10 w-full max-w-[620px] px-2 md:mt-20">
        <Card variant="outline">
          <CardHeader className="items-center text-center">
            <h1 className="text-2xl font-semibold">{heading}</h1>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
            <p className="font-medium">{body}</p>
            <Button
              render={
                <a href={`mailto:${settings.emailFrom}&subject:Cannot access ${page || url}`} />
              }
              nativeButton={false}
            >
              {actionLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
}
