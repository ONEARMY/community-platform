import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { UserProfile } from 'src/pages/User/content/UserProfile'
import { pageViewService } from 'src/services/pageView.service'
import { userService } from 'src/services/user.service'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'
import { Text } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { IUserDB } from 'oa-shared'
import type { UserCreatedDocs } from 'src/pages/User/types'

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id as string
  const [profile, userCreatedDocs] = await Promise.all([
    userService.getById(userId),
    userService.getUserCreatedDocs(userId),
  ])

  if (profile?._id) {
    // not awaited to not block the render
    pageViewService.incrementViewCount('users', profile._id)
  }

  return json({ profile, userCreatedDocs: userCreatedDocs || [] })
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
  const userCreatedDocs = data.userCreatedDocs as UserCreatedDocs

  if (!profile) {
    return (
      <Text
        sx={{
          width: '100%',
          textAlign: 'center',
          display: 'block',
          marginTop: 10,
        }}
      >
        User not found
      </Text>
    )
  }

  return <UserProfile profile={profile} userCreatedDocs={userCreatedDocs} />
}
