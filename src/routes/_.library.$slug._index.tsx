import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Library } from 'src/pages/Library/Content/Page/Library'
import { libraryService } from 'src/pages/Library/library.service'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { pageViewService } from 'src/services/pageViewService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { ILibrary } from 'oa-shared'

export async function loader({ params }: LoaderFunctionArgs) {
  const item = await libraryService.getBySlug(params.slug as string)

  if (item?._id) {
    // not awaited to not block the render
    pageViewService.incrementViewCount('library', item._id)
  }

  return json({ item })
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
}

export const meta = mergeMeta<typeof loader>(({ data }) => {
  const item = data?.item as ILibrary.DB

  if (!item) {
    return []
  }

  const title = `${item.title} - Library - ${import.meta.env.VITE_SITE_NAME}`

  return generateTags(title, item.description, item.cover_image?.downloadUrl)
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const item = data.item as ILibrary.DB // there is some inference issue, shouldn't need 'as'

  if (!item) {
    return <NotFoundPage />
  }

  return <Library item={item} />
}
