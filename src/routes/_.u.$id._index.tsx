import { useLoaderData } from '@remix-run/react'
import { ProfilePage } from 'src/pages/User/content/ProfilePage'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { libraryServiceServer } from 'src/services/libraryService.server'
import { pageViewService } from 'src/services/pageViewService.server'
import { questionServiceServer } from 'src/services/questionService.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { userService } from 'src/services/userService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'
import { Text } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { IUserDB } from 'oa-shared'
import type { UserCreatedDocs } from 'src/pages/User/types'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const username = params.id as string
  const [profile, projects, research, questions] = await Promise.all([
    userService.getById(username),
    libraryServiceServer.getUserProjects(client, username),
    researchServiceServer.getUserResearch(client, username),
    questionServiceServer.getQuestionsByUser(client, username),
  ])

  const userCreatedDocs = {
    projects,
    research,
    questions,
  } as UserCreatedDocs

  if (profile?._id) {
    // not awaited to not block the render
    pageViewService.incrementViewCount('users', profile._id)
  }

  return Response.json(
    {
      profile,
      userCreatedDocs,
    },
    { headers },
  )
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
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

  return <ProfilePage profile={profile} userCreatedDocs={userCreatedDocs} />
}
