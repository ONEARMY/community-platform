import Main from 'src/pages/common/Layout/Main'
import { mapPinService, MapPinServiceContext } from 'src/pages/Maps/map.service'
import MapsPage from 'src/pages/Maps/Maps.client'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

import '../styles/leaflet.css'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main
      customStyles={{
        position: 'relative',
        margin: '0',
        padding: '0',
        width: '100vw',
      }}
      ignoreMaxWidth={true}
    >
      <SeoTagsUpdateComponent title="Map" />
      <MapPinServiceContext.Provider value={mapPinService}>
        <MapsPage />
      </MapPinServiceContext.Provider>
    </Main>
  )
}
