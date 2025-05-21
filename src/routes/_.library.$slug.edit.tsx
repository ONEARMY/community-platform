import { redirect, useLoaderData } from '@remix-run/react'
import { Project } from 'oa-shared'
import { LibraryForm } from 'src/pages/Library/Content/Common/Library.form'
/* eslint-disable unicorn/filename-case */
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { libraryServiceServer } from 'src/services/libraryService.server'
import { redirectServiceServer } from 'src/services/redirectService.server'

import type { DBProject } from 'oa-shared'
import type { LoaderFunctionArgs } from 'react-router'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirectServiceServer.redirectSignIn(
      `/library/${params.slug}/edit`,
      headers,
    )
  }

  const username = user.user_metadata.username
  const projectDb = (await libraryServiceServer.getBySlug(
    client,
    params.slug as string,
  )) as unknown as DBProject
  const project = Project.fromDB(projectDb, [], [])
  if (
    !(await libraryServiceServer.isAllowedToEditProject(
      client,
      project,
      username,
    ))
  ) {
    return redirect('/forbidden', { headers })
  }

  return Response.json({ project }, { headers })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const item = data.project as Project

  return <LibraryForm project={item} />
}
