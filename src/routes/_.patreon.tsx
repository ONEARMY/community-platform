import Main from 'src/pages/common/Layout/Main'
import Patreon from 'src/pages/Patreon/Patreon'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Patreon" />
      <Patreon />
    </Main>
  )
}
