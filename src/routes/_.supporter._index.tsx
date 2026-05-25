import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { SupporterPage } from 'src/pages/Supporter/SupporterPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { StripeServiceServer, type SupporterPrice } from 'src/services/stripeService.server';
import { Flex, Heading, Text } from 'theme-ui';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  let isAuthenticated = false;
  let userEmail = '';
  try {
    const claims = await client.auth.getClaims();
    isAuthenticated = !!claims.data?.claims;
    if (isAuthenticated) {
      const { data: authUser } = await client.auth.getUser();
      userEmail = authUser.user?.email || '';
    }
  } catch {
    // Not authenticated
  }

  try {
    const stripeService = new StripeServiceServer(client);
    const prices = await stripeService.getPrices();
    return Response.json({ prices, isAuthenticated, userEmail });
  } catch (error) {
    console.error('Failed to load supporter prices:', error);
    return Response.json({ prices: [], isAuthenticated, userEmail });
  }
}

export default function Index() {
  const { prices, isAuthenticated, userEmail } = useLoaderData<{
    prices: SupporterPrice[];
    isAuthenticated: boolean;
    userEmail: string;
  }>();

  if (!prices.length) {
    return (
      <Main style={{ flex: 1 }}>
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            gap: 3,
          }}
        >
          <Heading as="h1">Supporter plans unavailable</Heading>
          <Text variant="quiet">We're having trouble loading pricing. Please try again later.</Text>
        </Flex>
      </Main>
    );
  }

  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>
        {() => (
          <SupporterPage prices={prices} isAuthenticated={isAuthenticated} userEmail={userEmail} />
        )}
      </ClientOnly>
    </Main>
  );
}
