import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { SupporterPage } from 'src/pages/Supporter/SupporterPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import type { SupporterPrice } from 'src/services/stripeService.server';
import { stripeServiceServer } from 'src/services/stripeService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  let isAuthenticated = false;
  try {
    const claims = await client.auth.getClaims();
    isAuthenticated = !!claims.data?.claims;
  } catch {
    // Not authenticated
  }

  try {
    const prices = await stripeServiceServer.getPrices();
    return Response.json({ prices, isAuthenticated });
  } catch (error) {
    console.error('Failed to load supporter prices:', error);
    return Response.json({ prices: [], isAuthenticated });
  }
}

export default function Index() {
  const { prices, isAuthenticated } = useLoaderData<{
    prices: SupporterPrice[];
    isAuthenticated: boolean;
  }>();

  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>
        {() => <SupporterPage prices={prices} isAuthenticated={isAuthenticated} />}
      </ClientOnly>
    </Main>
  );
}
