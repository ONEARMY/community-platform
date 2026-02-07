import Main from 'src/pages/common/Layout/Main';
import MapsPage from 'src/pages/Maps/Maps.client';
import { MapPinServiceContext, mapPinService } from 'src/pages/Maps/map.service';
import { SeoTagsUpdateComponent } from 'src/utils/seo';

import '../styles/leaflet.css';

export async function clientLoader() {
  return null;
}

export default function Index() {
  return (
    <Main ignoreMaxWidth={true}>
      <SeoTagsUpdateComponent title="Map" />
      <MapPinServiceContext.Provider value={mapPinService}>
        <MapsPage />
      </MapPinServiceContext.Provider>
    </Main>
  );
}
