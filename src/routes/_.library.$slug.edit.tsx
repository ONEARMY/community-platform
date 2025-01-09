import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
/* eslint-disable unicorn/filename-case */
import { AuthRoute } from 'src/pages/common/AuthRoute'
import EditLibrary from 'src/pages/Library/EditLibrary'
import { libraryService } from 'src/pages/Library/library.service'

import type { ILibrary } from 'oa-shared'
import type { LoaderFunctionArgs } from 'react-router'

export async function loader({ params }: LoaderFunctionArgs) {
  const item = await libraryService.getBySlug(params.slug as string)

  return json({ item })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const item = data.item as ILibrary.DB

  return (
    <AuthRoute>
      <EditLibrary item={item} />
    </AuthRoute>
  )
}
