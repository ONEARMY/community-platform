import Main from 'src/pages/common/Layout/Main'
import ResearchList from 'src/pages/Research/Content/ResearchList'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Research" />
      <ResearchList />
    </Main>
  )
}
