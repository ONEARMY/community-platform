import Main from 'src/pages/common/Layout/Main'
import Unsubscribe from 'src/pages/Unsubscribe/Unsubscribe'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Unsubscribe" />
      <Unsubscribe />
    </Main>
  )
}
