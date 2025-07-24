import { useLoaderData } from '@remix-run/react'
import { AuthorVotes, Profile } from 'oa-shared'
import { ProfilePage } from 'src/pages/User/content/ProfilePage'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { libraryServiceServer } from 'src/services/libraryService.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { questionServiceServer } from 'src/services/questionService.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'
import { Text } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { UserCreatedDocs } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)
  const profileService = new ProfileServiceServer(client)

  const username = params.id as string

  const [profileDb, projects, research, questions] = await Promise.all([
    profileService.getByUsername(username),
    libraryServiceServer.getUserProjects(client, username),
    researchServiceServer.getUserResearch(client, username),
    questionServiceServer.getQuestionsByUser(client, username),
  ])

  const userCreatedDocs = {
    projects,
    research,
    questions,
  } as UserCreatedDocs

  if (!profileDb) {
    return Response.json({ profile: null, headers })
  }

  const authorVotesDb = await profileService.getAuthorUsefulVotes(profileDb.id)
  const authorVotes = authorVotesDb
    ? authorVotesDb.map((x) => AuthorVotes.fromDB(x))
    : undefined
  const [photo] = profileDb.photo
    ? storageServiceServer.getPublicUrls(client, [profileDb.photo])
    : []
  const coverImages = profileDb.cover_images
    ? storageServiceServer.getPublicUrls(client, profileDb.cover_images)
    : undefined

  if (profileDb?.id) {
    // not awaited to not block the render
    profileService.incrementViewCount(profileDb.id, profileDb.total_views)
  }

  return Response.json(
    {
      profile: Profile.fromDB(profileDb, photo, coverImages, authorVotes),
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
  const profile = data?.profile as Profile

  if (!profile) {
    return []
  }

  const title = `${profile.displayName} - Profile - ${import.meta.env.VITE_SITE_NAME}`

  return generateTags(title)
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const profile = data.profile as Profile
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
