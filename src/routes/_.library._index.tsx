/* eslint-disable unicorn/filename-case */
import { HowtoList } from 'src/pages/Library/Content/List/LibraryList'
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
