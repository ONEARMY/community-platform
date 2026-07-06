import { data, LoaderFunctionArgs } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { MapPinServiceContext, mapPinService } from 'src/pages/Maps/map.service';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import '../styles/leaflet.css';
import { MapView } from 'src/pages/Maps/Content/MapView/MapView.client';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const tenantSettings = await new TenantSettingsService(client).get();

  return data(tenantSettings, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  return generateTags(`Map - ${loaderData?.siteName}`);
});

export default function Index() {
  return (
    <MapPinServiceContext.Provider value={mapPinService}>
      Checking
      <ClientOnly fallback={<></>}>{() => <MapView disableListView={true} />}</ClientOnly>
    </MapPinServiceContext.Provider>
  );
}
