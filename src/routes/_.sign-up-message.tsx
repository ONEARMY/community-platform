import { useLoaderData } from 'react-router';
import Main from 'src/pages/common/Layout/Main'
import SignUpMessagePage from 'src/pages/SignUp/SignUpMessage'

import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  // Get the raw search string and manually parse the email parameter, otherwise characters like '+' are ignored.
  const emailMatch = url.search.match(/[?&]email=([^&]*)/)
  const email = emailMatch ? decodeURIComponent(emailMatch[1]) : null

  return email
}

export default function Index() {
  const email = useLoaderData<typeof loader>()

  return (
    <Main style={{ flex: 1 }}>
      <SignUpMessagePage email={email} />
    </Main>
  )
}
