import { Layout } from 'src/pages/Layout'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <Layout>
      <NotFoundPage />
    </Layout>
  )
}
