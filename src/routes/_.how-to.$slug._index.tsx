import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { FIREBASE_CONFIG } from 'src/config/config'
// import { Howto } from 'src/pages/Howto/Content/Howto/Howto'
// import { howtoService } from 'src/pages/Howto/howto.service'
// import { generateTags, mergeMeta } from 'src/utils/seo.utils'

// import type { LoaderFunctionArgs } from '@remix-run/node'
// import type { IHowtoDB } from 'oa-shared'

export async function loader() {
  // const howto = await howtoService.getBySlug(params.slug as string)

  // if (!howto) {
  //   const searchSlug = (params.slug || '').replace(/-/gi, ' ')

  //   return redirect(`/how-to?search=${searchSlug}&source=how-to-not-found`)
  // }

  return json({ FIREBASE_CONFIG })
}

// export const meta = mergeMeta<typeof loader>(({ data }) => {
//   const howto = data?.howto as IHowtoDB
//   const title = `${howto?.title} - How-to - ${import.meta.env.VITE_SITE_NAME}`

//   return generateTags(title, howto.description, howto.cover_image?.downloadUrl)
// })

export default function Index() {
  const data = useLoaderData<typeof loader>()
  // const howto = data.howto as IHowtoDB

  return (
    <>
      <div style={{ display: 'none' }}>
        {JSON.stringify(data.FIREBASE_CONFIG)}
      </div>
      {/* <Howto howto={howto} /> */}
    </>
  )
}
