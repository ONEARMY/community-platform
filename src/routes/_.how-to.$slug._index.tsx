import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Howto } from 'src/pages/Howto/Content/Howto/Howto'
import { howtoService } from 'src/pages/Howto/howto.service'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { IHowtoDB } from 'oa-shared'

export async function loader({ params }: LoaderFunctionArgs) {
  const howto = await howtoService.getBySlug(params.slug as string)

  if (!howto) {
    const searchSlug = (params.slug || '').replace(/-/gi, ' ')

    return redirect(`/how-to?search=${searchSlug}&source=how-to-not-found`)
  }

  return json({ howto })
}

export const meta = mergeMeta<typeof loader>(({ data }) => {
  const howto = data?.howto as IHowtoDB
  const title = howto.title + ' - How-to'

  return generateTags(title, howto.description, howto.cover_image?.downloadUrl)
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const howto = data.howto as IHowtoDB // there is some inference issue, shouldn't need 'as'

  if (!howto) {
    return <NotFoundPage />
  }

  return <Howto howto={howto} />
}
