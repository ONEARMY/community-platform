import { FRIENDLY_MESSAGES } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { logger } from 'src/logger';
import Main from 'src/pages/common/Layout/Main';
import { SupporterPage } from 'src/pages/Supporter/SupporterPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { isBlockedRegion } from 'src/services/geoBlock.server';
import {
  StripeServiceServer,
  type SupporterPrice,
  type TierConfigMap,
} from 'src/services/stripeService.server';
import { Flex, Heading, Text } from 'theme-ui';

export async function loader({ request }: LoaderFunctionArgs) {
  if (await isBlockedRegion(request)) {
    return data({
      blocked: true,
      prices: [],
      tierConfig: {},
      thankYouImageUrl: null,
      isAuthenticated: false,
      userEmail: '',
    });
  }

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
    const [prices, tierConfigResult] = await Promise.all([
      stripeService.getPrices(),
      stripeService.getTierConfig(),
    ]);
    const { tiers: tierConfig, thankYouImageUrl } = tierConfigResult;
    return data({ prices, tierConfig, thankYouImageUrl, isAuthenticated, userEmail });
  } catch (error) {
    logger.error('Failed to load supporter prices:', error);
    return data({ prices: [], tierConfig: {}, thankYouImageUrl: null, isAuthenticated, userEmail });
  }
}

export default function Index() {
  const { blocked, prices, tierConfig, thankYouImageUrl, isAuthenticated, userEmail } =
    useLoaderData<{
      blocked?: boolean;
      prices: SupporterPrice[];
      tierConfig: TierConfigMap;
      thankYouImageUrl: string | null;
      isAuthenticated: boolean;
      userEmail: string;
    }>();

  if (blocked || !prices.length) {
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
          <Text variant="quiet">
            {blocked
              ? FRIENDLY_MESSAGES['supporter/region-blocked']
              : "We're having trouble loading pricing. Please try again later."}
          </Text>
        </Flex>
      </Main>
    );
  }

  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>
        {() => (
          <SupporterPage
            prices={prices}
            tierConfig={tierConfig}
            thankYouImageUrl={thankYouImageUrl}
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
          />
        )}
      </ClientOnly>
    </Main>
  );
}
