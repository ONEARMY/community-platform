import { redirect } from 'react-router'
import { useLoaderData } from '@remix-run/react'
import { ResearchItem } from 'src/models/research.model'
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdateForm'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { isAllowedToEditResearch } from 'src/services/researchPermissions.server'
import { researchServiceServer } from 'src/services/researchService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBResearchItem, ResearchUpdate } from 'src/models/research.model'

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

  const profileResult = await client
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .limit(1)
  const currentUserId = profileResult.data?.at(0)?.id

  const username = user.user_metadata.username
  const researchDb = result.data as unknown as DBResearchItem
  const { images, files } = researchServiceServer.getResearchPublicMedia(
    researchDb,
    client,
  )
  const research = ResearchItem.fromDB(
    researchDb,
    [],
    images,
    files,
    currentUserId,
  )
  const update = research.updates.find((x) => x.id === Number(params.updateId))

  if (!update) {
    return redirect('/research')
  }

  if (!(await isAllowedToEditResearch(client, research, username))) {
    return redirect('/research')
  }

  return Response.json({ research, update }, { headers })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const research = data.research as ResearchItem
  const update = data.update as ResearchUpdate

  return <ResearchUpdateForm research={research} researchUpdate={update} />
}
