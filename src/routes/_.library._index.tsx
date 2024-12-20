/* eslint-disable unicorn/filename-case */
import { HowtoList } from 'src/pages/Howto/Content/HowtoList/HowtoList'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <>
      <SeoTagsUpdateComponent title="Library" />
      <HowtoList />
    </>
  )
}
