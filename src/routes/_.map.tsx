import Main from 'src/pages/common/Layout/Main';
import MapsPage from 'src/pages/Maps/Maps.client';
import { MapPinServiceContext, mapPinService } from 'src/pages/Maps/map.service';
import '../styles/leaflet.css';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader() {
  return null;
}

export const meta = mergeMeta(() => {
  return generateTags(`Map - ${import.meta.env.VITE_SITE_NAME}`);
});

export default function Index() {
  return (
    <Main ignoreMaxWidth={true}>
      <MapPinServiceContext.Provider value={mapPinService}>
        <MapsPage />
      </MapPinServiceContext.Provider>
    </Main>
  );
}
