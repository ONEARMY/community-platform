import Main from 'src/pages/common/Layout/Main'
import TermsPolicy from 'src/pages/policy/TermsPolicy'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <SeoTagsUpdateComponent title="Terms of Use" />
      <TermsPolicy />
    </Main>
  )
}
