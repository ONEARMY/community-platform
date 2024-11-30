import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { UserRole } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { SettingsPage } from 'src/pages/UserSettings/SettingsPage.client'
import { userService } from 'src/services/userService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { IUserDB } from 'oa-shared'

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id as string
  const profile = await userService.getById(userId)

  return json({ profile })
}

export const meta = mergeMeta<typeof loader>(({ data }) => {
  const profile = data?.profile as IUserDB

  if (!profile) {
    return []
  }

  const title = `${profile.displayName} - Profile - ${import.meta.env.VITE_SITE_NAME}`

  return generateTags(title)
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const profile = data.profile as IUserDB

  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <AuthRoute roleRequired={UserRole.ADMIN}>
          <SettingsPage profile={profile} />
        </AuthRoute>
      )}
    </ClientOnly>
  )
}
