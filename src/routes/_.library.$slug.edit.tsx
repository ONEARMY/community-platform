import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
/* eslint-disable unicorn/filename-case */
import { AuthRoute } from 'src/pages/common/AuthRoute'
import EditHowto from 'src/pages/Howto/Content/EditHowto/EditHowto'
import { howtoService } from 'src/pages/Howto/howto.service'

import type { ILibrary } from 'oa-shared'
import type { LoaderFunctionArgs } from 'react-router'

export async function loader({ params }: LoaderFunctionArgs) {
  const howto = await howtoService.getBySlug(params.slug as string)

  return json({ howto })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const howto = data.howto as ILibrary.DB

  return (
    <AuthRoute>
      <EditHowto howto={howto} />
    </AuthRoute>
  )
}
