import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import { mapPinService, MapPinServiceContext } from 'src/pages/Maps/map.service'
import MapsPage from 'src/pages/Maps/Maps.client'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Layout>
      <SeoTagsUpdateComponent title="Map" />
      <Main
        data-cy="main-layout-container"
        customStyles={{
          position: 'relative',
          margin: '0',
          padding: '0',
          width: '100vw',
        }}
        ignoreMaxWidth={true}
      >
        <MapPinServiceContext.Provider value={mapPinService}>
          <MapsPage />
        </MapPinServiceContext.Provider>
      </Main>
    </Layout>
  )
}
