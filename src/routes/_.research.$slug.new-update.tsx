import { redirect, useLoaderData } from '@remix-run/react'
import { ResearchItem } from 'oa-shared'
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { researchServiceServer } from 'src/services/researchService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBResearchItem } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirect('/research')
  }

  const result = await researchServiceServer.getBySlug(
    client,
    params.slug as string,
  )

  if (result.error || !result.data) {
    return Response.json({ research: null }, { headers })
  }

  const username = user.user_metadata.username
  const researchDb = result.data as unknown as DBResearchItem
  const research = ResearchItem.fromDB(researchDb, [])

  if (
    !(await researchServiceServer.isAllowedToEditResearch(
      client,
      research,
      username,
    ))
  ) {
    return redirect('/research')
  }

  return Response.json({ research }, { headers })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const research = data.research as ResearchItem

  return <ResearchUpdateForm research={research} />
}
