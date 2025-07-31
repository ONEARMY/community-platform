import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const { client, headers } = createSupabaseServerClient(request)

//   try {
//     const formData = await request.formData()
//         const {
//       data: { user },
//     } = await client.auth.getUser()

//     const { data: profileData } = await client
//       .from('profiles')
//       .select('id')
//       .eq('auth_id', user?.id)
//       .single()

//     const { valid, status, statusText } = await validateRequest(
//       request,
//       user,
//       data,
//       profileData,
//     )

//   }
// }

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const profileTagsResult = await client
    .from('profile_tags')
    .select('id,created_at,name,profile_type')

  const tags = profileTagsResult.data || []

  return Response.json(tags, { headers, status: 200 })
}
