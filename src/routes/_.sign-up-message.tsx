import { useLoaderData } from '@remix-run/react'
import Main from 'src/pages/common/Layout/Main'
import SignUpMessagePage from 'src/pages/SignUp/SignUpMessage'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  return url.searchParams.get('email')
}

export default function Index() {
  const email = useLoaderData<typeof loader>()

  return (
    <Main style={{ flex: 1 }}>
      <SignUpMessagePage email={email} />
    </Main>
  )
}
