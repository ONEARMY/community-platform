import Academy from 'src/pages/Academy/Academy'
import Main from 'src/pages/common/Layout/Main'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main
      style={{ flex: 1 }}
      customStyles={{
        position: 'relative',
        margin: '0',
        padding: '0',
        width: '100vw',
      }}
      ignoreMaxWidth={true}
    >
      <SeoTagsUpdateComponent title="Academy" />
      <Academy />
    </Main>
  )
}
