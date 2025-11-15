import { redirect, useLoaderData } from 'react-router'
import { ResearchItem } from 'oa-shared'
import { ResearchUpdateForm } from 'src/pages/Research/Content/Common/ResearchUpdateForm'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { redirectServiceServer } from 'src/services/redirectService.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { storageServiceServer } from 'src/services/storageService.server'

import type { ResearchUpdate } from 'oa-shared'
import type { LoaderFunctionArgs } from 'react-router'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const claims = await client.auth.getClaims()

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(
      `/research/${params.slug}/edit-update/${params.updateId}`,
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

  const username = claims.data.claims.user_metadata.username
  const researchDb = result.item
  const images = researchServiceServer.getResearchPublicMedia(
    researchDb,
    client,
  )
  const research = ResearchItem.fromDB(
    researchDb,
    [],
    images,
    result.collaborators,
    username,
  )
  const update = research.updates.find((x) => x.id === Number(params.updateId))

  if (!update) {
    return redirect('/research')
  }

  if (
    !(await researchServiceServer.isAllowedToEditResearch(
      client,
      research,
      username,
    ))
  ) {
    return redirect('/forbidden?page=research-update-edit', { headers })
  }

  const updateDb = researchDb.updates.find(
    (x) => x.id === Number(params.updateId),
  )
  const fileLink = updateDb?.file_link
  const files = updateDb?.files?.at(0)
    ? await storageServiceServer.getPathDocuments(
        `research/${research.id}/updates/${update.id}`,
        `/api/documents/research_update/${update.id}`,
        client,
      )
    : []

  return Response.json({ research, update, fileLink, files }, { headers })
}

export default function Index() {
  const data: any = useLoaderData<typeof loader>()
  const research = data.research as ResearchItem
  const update = data.update as ResearchUpdate

  return (
    <ResearchUpdateForm
      research={research}
      researchUpdate={update}
      fileLink={data.fileLink}
      files={data.files}
    />
  )
}
