/* eslint-disable unicorn/filename-case */
import Main from 'src/pages/common/Layout/Main'
import { Howto } from 'src/pages/Howto/Content/Howto/Howto'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="How To" />
      <Howto />
    </Main>
  )
}
