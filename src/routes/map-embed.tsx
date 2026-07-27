import type { ILatLng, MapPin } from 'oa-shared';
import { useState } from 'react';
import { data, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { MapView } from 'src/pages/Maps/Content/MapView/MapView.client';
import { MapContext } from 'src/pages/Maps/MapContext';
import { MapPinServiceContext, mapPinService } from 'src/pages/Maps/map.service';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { MapPinsServiceServer } from 'src/services/mapPinsService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import '../styles/leaflet.css';
import type { LatLngBounds, Map as LeafletMap } from 'leaflet';
import { Box } from 'theme-ui';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const url = new URL(request.url);
  const typeParam = url.searchParams.get('type') as string;
  const zoomParam = url.searchParams.get('zoom');
  const latParam = url.searchParams.get('lat');
  const lngParam = url.searchParams.get('lng');
  const clustersParam = url.searchParams.get('clusters');

  try {
    const [tenantSettings, pins] = await Promise.all([
      new TenantSettingsService(client).get(),
      new MapPinsServiceServer(client).getByProfileType(typeParam),
    ]);

    return data(
      {
        tenantSettings,
        pins,
        initialZoom: zoomParam ? parseFloat(zoomParam) : undefined,
        initialLat: latParam ? parseFloat(latParam) : undefined,
        initialLng: lngParam ? parseFloat(lngParam) : undefined,
        enableClusters: clustersParam === 'true',
      },
      { headers },
    );
  } catch (error) {
    console.error('Error loading map embed data:', error);
    throw error;
  }
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  return generateTags(`Map - ${loaderData?.tenantSettings?.siteName}`);
});

function MapEmbed() {
  const loaderData = useLoaderData<typeof loader>();
  const [zoom, setZoom] = useState(loaderData.initialZoom ?? 3);
  const [location, setLocation] = useState<ILatLng>({
    lat: loaderData.initialLat ?? 15,
    lng: loaderData.initialLng ?? 10,
  });
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);

  const mapContextValue = {
    allPins: loaderData.pins,
    mapPins: loaderData.pins,
    filteredPins: loaderData.pins,
    location,
    selectedPin,
    zoom,
    setLocation,
    selectPin: setSelectedPin,
    setZoom,
    setView: (loc: ILatLng, z: number) => {
      setLocation(loc);
      setZoom(z);
      console.log(z);
    },
    panTo: (loc: ILatLng) => setLocation(loc),
    fitBounds: (bounds: LatLngBounds) => {
      if (mapRef) {
        mapRef.fitBounds(bounds);
      }
    },
    setMapRef,
  };

  return (
    <MapContext.Provider value={mapContextValue}>
      <Box sx={{ width: '100vw', height: '100vh' }}>
        <MapView disableListView={true} disableClusters={!loaderData.enableClusters} />
      </Box>
    </MapContext.Provider>
  );
}

export default function Index() {
  return (
    <MapPinServiceContext.Provider value={mapPinService}>
      <ClientOnly fallback={<></>}>{() => <MapEmbed />}</ClientOnly>
    </MapPinServiceContext.Provider>
  );
}
