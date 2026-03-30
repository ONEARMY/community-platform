import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import Main from 'src/pages/common/Layout/Main';
import { SupporterPage } from 'src/pages/Supporter/SupporterPage';
import type { SupporterPrice } from 'src/services/stripeService.server';
import { stripeServiceServer } from 'src/services/stripeService.server';

export async function loader({ request: _request }: LoaderFunctionArgs) {
  try {
    const prices = await stripeServiceServer.getPrices();
    return Response.json({ prices });
  } catch (error) {
    console.error('Failed to load supporter prices:', error);
    return Response.json({ prices: [] });
  }
}

export default function Index() {
  const { prices } = useLoaderData<{ prices: SupporterPrice[] }>();

  return (
    <Main style={{ flex: 1 }}>
      <ClientOnly fallback={<></>}>{() => <SupporterPage prices={prices} />}</ClientOnly>
    </Main>
  );
}
