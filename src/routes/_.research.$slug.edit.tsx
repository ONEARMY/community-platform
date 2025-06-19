import { redirect, useLoaderData } from '@remix-run/react'
import { ResearchItem } from 'oa-shared'
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { redirectServiceServer } from 'src/services/redirectService.server'
import { researchServiceServer } from 'src/services/researchService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBResearchItem } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirectServiceServer.redirectSignIn(
      `/research/${params.slug}/edit`,
      headers,
    )
  }

  const result = await researchServiceServer.getBySlug(
    client,
    params.slug as string,
  )

  if (result.error || !result.item) {
    return Response.json({ research: null }, { headers })
  }

  const currentUsername = user.user_metadata.username
  const researchDb = result.item as unknown as DBResearchItem
  const images = researchServiceServer.getResearchPublicMedia(
    researchDb,
    client,
  )

  const research = ResearchItem.fromDB(researchDb, [], images, currentUsername)

  if (
    !(await researchServiceServer.isAllowedToEditResearch(
      client,
      research,
      currentUsername,
    ))
  ) {
    return redirect('/forbidden', { headers })
  }

  return Response.json({ research }, { headers })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const research = data.research as ResearchItem

  return <ResearchForm research={research} />
}
