import Main from 'src/pages/common/Layout/Main'
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage.client'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { redirectServiceServer } from 'src/services/redirectService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirectServiceServer.redirectSignIn('/settings', headers)
  }

  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
      <Settings />
    </Main>
  )
}

const Settings = () => {
  return <SettingsPage />
}
