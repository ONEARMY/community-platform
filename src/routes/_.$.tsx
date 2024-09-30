import { NotFoundPage } from 'src/pages/NotFound/NotFound'

export async function clientLoader() {
  return null
}

export default function Index() {
  return <NotFoundPage />
}
